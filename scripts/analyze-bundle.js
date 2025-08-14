#!/usr/bin/env node

/**
 * Bundle analiz scripti
 * Vite build sonrasında bundle boyutlarını ve bağımlılıkları analiz eder
 */

import { readFileSync, writeFileSync, existsSync } from 'fs'
import { join } from 'path'
import { execSync } from 'child_process'

const BUILD_DIR = 'dist'
const ASSETS_DIR = join(BUILD_DIR, 'assets')
const REPORT_DIR = 'reports'
const REPORT_FILE = join(REPORT_DIR, 'bundle-analysis.json')

/**
 * Bundle dosyalarını analiz et
 */
function analyzeBundleFiles() {
  if (!existsSync(ASSETS_DIR)) {
    console.error('❌ Build klasörü bulunamadı. Önce "npm run build" çalıştırın.')
    process.exit(1)
  }

  const files = []
  const fs = require('fs')
  
  fs.readdirSync(ASSETS_DIR).forEach(file => {
    const filePath = join(ASSETS_DIR, file)
    const stats = fs.statSync(filePath)
    
    if (stats.isFile()) {
      const sizeKB = Math.round(stats.size / 1024 * 100) / 100
      const type = getFileType(file)
      
      files.push({
        name: file,
        path: filePath,
        size: stats.size,
        sizeKB,
        sizeMB: Math.round(sizeKB / 1024 * 100) / 100,
        type,
        gzipSize: getGzipSize(filePath),
      })
    }
  })

  return files.sort((a, b) => b.size - a.size)
}

/**
 * Dosya tipini belirle
 */
function getFileType(filename) {
  if (filename.endsWith('.js')) return 'javascript'
  if (filename.endsWith('.css')) return 'stylesheet'
  if (filename.endsWith('.map')) return 'sourcemap'
  if (filename.match(/\.(png|jpg|jpeg|gif|svg|webp)$/)) return 'image'
  if (filename.match(/\.(woff|woff2|ttf|eot)$/)) return 'font'
  return 'other'
}

/**
 * Gzip boyutunu hesapla
 */
function getGzipSize(filePath) {
  try {
    const content = readFileSync(filePath)
    const zlib = require('zlib')
    const gzipped = zlib.gzipSync(content)
    return Math.round(gzipped.length / 1024 * 100) / 100
  } catch (error) {
    console.warn(`Gzip boyutu hesaplanamadı: ${filePath}`)
    return 0
  }
}

/**
 * Package.json'dan bağımlılıkları al
 */
function getDependencyInfo() {
  try {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'))
    const dependencies = packageJson.dependencies || {}
    const devDependencies = packageJson.devDependencies || {}
    
    return {
      production: Object.keys(dependencies).length,
      development: Object.keys(devDependencies).length,
      total: Object.keys(dependencies).length + Object.keys(devDependencies).length,
      productionDeps: dependencies,
      devDeps: devDependencies,
    }
  } catch (error) {
    console.warn('Package.json okunamadı:', error.message)
    return null
  }
}

/**
 * Büyük bağımlılıkları tespit et
 */
function findLargeDependencies() {
  try {
    // npm ls komutuyla bağımlılık boyutlarını al
    const result = execSync('npm ls --depth=0 --json', { encoding: 'utf8' })
    const data = JSON.parse(result)
    
    const largeDeps = []
    
    if (data.dependencies) {
      Object.entries(data.dependencies).forEach(([name, info]) => {
        if (info && typeof info === 'object' && 'version' in info) {
          // Node_modules klasöründeki boyutu kontrol et
          try {
            const depPath = join('node_modules', name)
            if (existsSync(depPath)) {
              const size = getDirSize(depPath)
              const sizeKB = Math.round(size / 1024)
              
              if (sizeKB > 500) { // 500KB'den büyük bağımlılıklar
                largeDeps.push({
                  name,
                  version: info.version,
                  size: sizeKB,
                  sizeMB: Math.round(sizeKB / 1024 * 100) / 100,
                })
              }
            }
          } catch (error) {
            // Boyut hesaplanamadı, atla
          }
        }
      })
    }
    
    return largeDeps.sort((a, b) => b.size - a.size)
  } catch (error) {
    console.warn('Bağımlılık analizi yapılamadı:', error.message)
    return []
  }
}

/**
 * Klasör boyutunu hesapla
 */
function getDirSize(dirPath) {
  let size = 0
  const fs = require('fs')
  
  try {
    const files = fs.readdirSync(dirPath)
    
    for (const file of files) {
      const filePath = join(dirPath, file)
      const stats = fs.statSync(filePath)
      
      if (stats.isDirectory()) {
        size += getDirSize(filePath)
      } else {
        size += stats.size
      }
    }
  } catch (error) {
    // Erişim hatası, atla
  }
  
  return size
}

/**
 * Performans önerileri oluştur
 */
function generateRecommendations(analysis) {
  const recommendations = []
  
  // Bundle boyutu kontrolü
  const totalJS = analysis.files
    .filter(f => f.type === 'javascript')
    .reduce((sum, f) => sum + f.sizeKB, 0)
    
  const totalCSS = analysis.files
    .filter(f => f.type === 'stylesheet')
    .reduce((sum, f) => sum + f.sizeKB, 0)

  if (totalJS > 1000) {
    recommendations.push({
      type: 'warning',
      category: 'bundle-size',
      message: `JavaScript bundle boyutu çok büyük: ${totalJS}KB. Code splitting kullanmayı düşünün.`,
      priority: 'high',
    })
  }

  if (totalCSS > 200) {
    recommendations.push({
      type: 'warning',
      category: 'css-size',
      message: `CSS boyutu büyük: ${totalCSS}KB. Unused CSS'leri temizlemeyi düşünün.`,
      priority: 'medium',
    })
  }

  // Büyük bağımlılık kontrolü
  if (analysis.largeDependencies.length > 0) {
    const largest = analysis.largeDependencies[0]
    if (largest.size > 2000) {
      recommendations.push({
        type: 'warning',
        category: 'large-dependency',
        message: `${largest.name} çok büyük (${largest.sizeMB}MB). Alternatif arayın veya lazy loading kullanın.`,
        priority: 'high',
      })
    }
  }

  // Gzip optimizasyonu
  const poorGzipFiles = analysis.files.filter(f => {
    const gzipRatio = f.gzipSize / f.sizeKB
    return f.sizeKB > 50 && gzipRatio > 0.7 // Gzip oranı %70'den fazla
  })

  if (poorGzipFiles.length > 0) {
    recommendations.push({
      type: 'info',
      category: 'compression',
      message: `${poorGzipFiles.length} dosya gzip ile iyi sıkışmıyor. Minification kontrolü yapın.`,
      priority: 'low',
    })
  }

  return recommendations
}

/**
 * HTML rapor oluştur
 */
function generateHTMLReport(analysis) {
  const html = `
<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bundle Analiz Raporu</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; line-height: 1.6; color: #333; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; background: white; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 8px 8px 0 0; }
        .header h1 { font-size: 2em; margin-bottom: 10px; }
        .header p { opacity: 0.9; }
        .content { padding: 30px; }
        .metrics { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 20px; margin-bottom: 30px; }
        .metric { background: #f8f9fa; padding: 20px; border-radius: 6px; border-left: 4px solid #007bff; }
        .metric h3 { color: #495057; margin-bottom: 10px; }
        .metric .value { font-size: 2em; font-weight: bold; color: #007bff; }
        .metric .label { color: #6c757d; font-size: 0.9em; }
        .section { margin-bottom: 40px; }
        .section h2 { color: #343a40; margin-bottom: 20px; padding-bottom: 10px; border-bottom: 2px solid #e9ecef; }
        .table { width: 100%; border-collapse: collapse; background: white; border-radius: 6px; overflow: hidden; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .table th, .table td { padding: 12px; text-align: left; border-bottom: 1px solid #e9ecef; }
        .table th { background: #f8f9fa; font-weight: 600; color: #495057; }
        .table tbody tr:hover { background: #f8f9fa; }
        .file-type { display: inline-block; padding: 4px 8px; border-radius: 4px; font-size: 0.8em; font-weight: 500; }
        .file-type.javascript { background: #fff3cd; color: #856404; }
        .file-type.stylesheet { background: #d1ecf1; color: #0c5460; }
        .file-type.image { background: #d4edda; color: #155724; }
        .file-type.font { background: #f8d7da; color: #721c24; }
        .recommendations { background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 6px; padding: 20px; }
        .recommendation { margin-bottom: 15px; padding: 15px; border-radius: 4px; }
        .recommendation.high { background: #f8d7da; border-left: 4px solid #dc3545; }
        .recommendation.medium { background: #fff3cd; border-left: 4px solid #ffc107; }
        .recommendation.low { background: #d1ecf1; border-left: 4px solid #17a2b8; }
        .chart { margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>📊 Bundle Analiz Raporu</h1>
            <p>Tarih: ${new Date().toLocaleDateString('tr-TR')} ${new Date().toLocaleTimeString('tr-TR')}</p>
        </div>
        
        <div class="content">
            <div class="metrics">
                <div class="metric">
                    <h3>Toplam Dosya Sayısı</h3>
                    <div class="value">${analysis.files.length}</div>
                    <div class="label">Build çıktısı</div>
                </div>
                <div class="metric">
                    <h3>Toplam Boyut</h3>
                    <div class="value">${(analysis.totalSize / 1024 / 1024).toFixed(2)} MB</div>
                    <div class="label">Sıkışmamış</div>
                </div>
                <div class="metric">
                    <h3>Gzip Boyutu</h3>
                    <div class="value">${(analysis.totalGzipSize / 1024).toFixed(2)} MB</div>
                    <div class="label">Sıkışmış (%${((analysis.totalGzipSize / analysis.totalSize) * 100).toFixed(1)})</div>
                </div>
                <div class="metric">
                    <h3>Bağımlılık Sayısı</h3>
                    <div class="value">${analysis.dependencies ? analysis.dependencies.production : 'N/A'}</div>
                    <div class="label">Production</div>
                </div>
            </div>
            
            <div class="section">
                <h2>📁 Bundle Dosyaları</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Dosya</th>
                            <th>Tip</th>
                            <th>Boyut</th>
                            <th>Gzip</th>
                            <th>Sıkıştırma</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${analysis.files.map(file => `
                        <tr>
                            <td><code>${file.name}</code></td>
                            <td><span class="file-type ${file.type}">${file.type}</span></td>
                            <td>${file.sizeKB} KB</td>
                            <td>${file.gzipSize} KB</td>
                            <td>%${((file.gzipSize / file.sizeKB) * 100).toFixed(1)}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            
            ${analysis.largeDependencies.length > 0 ? `
            <div class="section">
                <h2>📦 Büyük Bağımlılıklar</h2>
                <table class="table">
                    <thead>
                        <tr>
                            <th>Paket</th>
                            <th>Versiyon</th>
                            <th>Boyut</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${analysis.largeDependencies.map(dep => `
                        <tr>
                            <td><code>${dep.name}</code></td>
                            <td>${dep.version}</td>
                            <td>${dep.sizeMB} MB</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
            ` : ''}
            
            ${analysis.recommendations.length > 0 ? `
            <div class="section">
                <h2>💡 Öneriler</h2>
                <div class="recommendations">
                    ${analysis.recommendations.map(rec => `
                    <div class="recommendation ${rec.priority}">
                        <strong>${rec.category.toUpperCase()}:</strong> ${rec.message}
                    </div>
                    `).join('')}
                </div>
            </div>
            ` : ''}
        </div>
    </div>
</body>
</html>
  `
  
  return html
}

/**
 * Ana analiz fonksiyonu
 */
function main() {
  console.log('🔍 Bundle analizi başlatılıyor...\n')
  
  // Build klasörünü kontrol et
  if (!existsSync(BUILD_DIR)) {
    console.log('📦 Build yapılıyor...')
    try {
      execSync('npm run build', { stdio: 'inherit' })
    } catch (error) {
      console.error('❌ Build başarısız:', error.message)
      process.exit(1)
    }
  }
  
  // Dosyaları analiz et
  console.log('📁 Bundle dosyaları analiz ediliyor...')
  const files = analyzeBundleFiles()
  
  // Bağımlılıkları analiz et
  console.log('📦 Bağımlılıklar analiz ediliyor...')
  const dependencies = getDependencyInfo()
  const largeDependencies = findLargeDependencies()
  
  // Toplam boyutları hesapla
  const totalSize = files.reduce((sum, f) => sum + f.size, 0)
  const totalGzipSize = files.reduce((sum, f) => sum + (f.gzipSize * 1024), 0)
  
  // Analiz sonuçlarını birleştir
  const analysis = {
    timestamp: new Date().toISOString(),
    files,
    dependencies,
    largeDependencies,
    totalSize,
    totalGzipSize,
    recommendations: [],
  }
  
  // Öneriler oluştur
  console.log('💡 Performans önerileri oluşturuluyor...')
  analysis.recommendations = generateRecommendations(analysis)
  
  // Reports klasörünü oluştur
  const fs = require('fs')
  if (!existsSync(REPORT_DIR)) {
    fs.mkdirSync(REPORT_DIR, { recursive: true })
  }
  
  // JSON raporu kaydet
  writeFileSync(REPORT_FILE, JSON.stringify(analysis, null, 2))
  
  // HTML raporu oluştur
  const htmlReport = generateHTMLReport(analysis)
  const htmlFile = join(REPORT_DIR, 'bundle-report.html')
  writeFileSync(htmlFile, htmlReport)
  
  // Sonuçları göster
  console.log('\n📊 BUNDLE ANALİZ SONUÇLARI')
  console.log('='.repeat(50))
  console.log(`📁 Toplam dosya: ${files.length}`)
  console.log(`💾 Toplam boyut: ${(totalSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`🗜️  Gzip boyutu: ${(totalGzipSize / 1024 / 1024).toFixed(2)} MB`)
  console.log(`📉 Sıkıştırma: %${((totalGzipSize / totalSize) * 100).toFixed(1)}`)
  
  if (dependencies) {
    console.log(`📦 Üretim bağımlılıkları: ${dependencies.production}`)
    console.log(`🔧 Geliştirme bağımlılıkları: ${dependencies.development}`)
  }
  
  if (largeDependencies.length > 0) {
    console.log(`\n⚠️  Büyük bağımlılıklar (${largeDependencies.length}):`)
    largeDependencies.slice(0, 5).forEach(dep => {
      console.log(`   - ${dep.name}: ${dep.sizeMB} MB`)
    })
  }
  
  if (analysis.recommendations.length > 0) {
    console.log(`\n💡 Öneriler (${analysis.recommendations.length}):`)
    analysis.recommendations.forEach(rec => {
      const icon = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🔵'
      console.log(`   ${icon} ${rec.message}`)
    })
  }
  
  console.log(`\n📄 Raporlar kaydedildi:`)
  console.log(`   - ${REPORT_FILE}`)
  console.log(`   - ${htmlFile}`)
  console.log(`\n✅ Analiz tamamlandı!`)
}

// Script çalıştır
if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
