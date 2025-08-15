import { useState } from 'react'
import TypeScriptPatternsExample from '../components/TypeScriptPatternsExample'

export default function TypeScriptPatternsDemo() {
  const [saveCount, setSaveCount] = useState(0)
  
  const handleSave = () => {
    setSaveCount(prev => prev + 1)
    console.log('Save function called!')
  }
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-bold mb-6">TypeScript Patterns Demo</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Example 1: Basic usage */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Basic Example</h2>
          <TypeScriptPatternsExample onSave={handleSave}>
            <p className="text-sm text-gray-600 mb-2">
              This component demonstrates all seven TypeScript patterns:
            </p>
            <ul className="text-xs text-gray-500 space-y-1">
              <li>• Event types (React.ChangeEvent)</li>
              <li>• useRef with HTMLInputElement</li>
              <li>• useState with union types (number | null)</li>
              <li>• Props type definition</li>
              <li>• Safe indexing (Dict&lt;T&gt;)</li>
              <li>• Unknown type narrowing</li>
              <li>• API response types</li>
            </ul>
          </TypeScriptPatternsExample>
        </div>
        
        {/* Example 2: Without children */}
        <div>
          <h2 className="text-lg font-semibold mb-3">Without Children</h2>
          <TypeScriptPatternsExample onSave={handleSave} />
        </div>
      </div>
      
      {/* Save counter */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold mb-2">Save Counter</h3>
        <p className="text-sm">
          Save button clicked: <span className="font-mono bg-white px-2 py-1 rounded">{saveCount}</span> times
        </p>
      </div>
      
      {/* Pattern explanations */}
      <div className="mt-8 space-y-4">
        <h2 className="text-xl font-semibold">Pattern Explanations</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">4a) Event Types</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  console.log(e.currentTarget.value);
};`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Properly typed event handlers for form inputs
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">4b) useRef</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`const inputRef = React.useRef<HTMLInputElement | null>(null);`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Typed refs for direct DOM element access
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">4c) useState + Union</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`const [amount, setAmount] = useState<number | null>(null);
if (amount == null) return null; // aşağısı number`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Union types with early return pattern for type narrowing
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">4d) Props</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`type Props = { 
  children?: React.ReactNode; 
  onSave?: () => void 
}`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Type-safe component props with optional properties
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">5a) Safe Indexing</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`type Dict<T> = Record<string, T>;
const map: Dict<number> = {};
const val = map[key]; // number`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Generic dictionary types for safe object property access
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">5b) Unknown Type Narrowing</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`function handle(x: unknown) {
  if (typeof x === 'string') { 
    /* x: string */ 
  }
}`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Type guards for safe handling of unknown data types
            </p>
          </div>
          
          <div className="p-4 border rounded-lg">
            <h3 className="font-semibold mb-2">5c) API Response Type</h3>
            <pre className="text-xs bg-gray-100 p-2 rounded overflow-x-auto">
{`type ApiResp<T> = { 
  data: T; 
  error?: string 
};`}
            </pre>
            <p className="text-sm text-gray-600 mt-2">
              Generic API response types for consistent error handling
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
