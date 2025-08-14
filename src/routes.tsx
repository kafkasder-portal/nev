import { lazy } from 'react'
import { Routes, Route } from 'react-router-dom'
import { ProtectedRoute } from './components/ProtectedRoute'
import {
  withAidSuspense,
  withDonationsSuspense,
  withScholarshipSuspense,
  withMessagesSuspense,
  withFundSuspense,
  withSystemSuspense,
  withDefinitionsSuspense,
  withDashboardSuspense,
  withMeetingsSuspense,
  withInternalMessagesSuspense,
  withTasksSuspense
} from './components/loading/ModuleSuspenseWrapper'

// Login page (no protection needed)
const Login = lazy(() => import('./pages/Login'))
const NotFound = lazy(() => import('./pages/NotFound'))

// Donations
const DonationsList = lazy(() => import('./pages/donations/List'))
const DonationVault = lazy(() => import('./pages/donations/DonationVault'))
const Institutions = lazy(() => import('./pages/donations/Institutions'))
const CashDonations = lazy(() => import('./pages/donations/CashDonations'))
const BankDonations = lazy(() => import('./pages/donations/BankDonations'))
const CreditCardDonations = lazy(() => import('./pages/donations/CreditCardDonations'))
const OnlineDonations = lazy(() => import('./pages/donations/OnlineDonations'))
const DonationNumbers = lazy(() => import('./pages/donations/DonationNumbers'))
const FundingDefinitions = lazy(() => import('./pages/donations/FundingDefinitions'))
const SacrificePeriods = lazy(() => import('./pages/donations/SacrificePeriods'))
const SacrificeShares = lazy(() => import('./pages/donations/SacrificeShares'))
const RamadanPeriods = lazy(() => import('./pages/donations/RamadanPeriods'))
const PiggyBankTracking = lazy(() => import('./pages/donations/PiggyBankTracking'))
const BulkProvisioning = lazy(() => import('./pages/donations/BulkProvisioning'))

// Messages
const MessagesIndex = lazy(() => import('./pages/messages/Index'))
const BulkSend = lazy(() => import('./pages/messages/BulkSend'))
const Groups = lazy(() => import('./pages/messages/Groups'))
const Templates = lazy(() => import('./pages/messages/Templates'))
const SmsDeliveries = lazy(() => import('./pages/messages/SmsDeliveries'))
const EmailDeliveries = lazy(() => import('./pages/messages/EmailDeliveries'))
const Analytics = lazy(() => import('./pages/messages/Analytics'))
const MessageModuleInfo = lazy(() => import('./pages/messages/ModuleInfo'))

// Scholarship
const OrphansStudents = lazy(() => import('./pages/scholarship/OrphansStudents'))
const ScholarshipReports = lazy(() => import('./pages/scholarship/Reports'))

// Dashboard
const DashboardIndex = lazy(() => import('./pages/dashboard/Index'))

// Supabase Test
const SupabaseTest = lazy(() => import('./components/SupabaseTest'))

// Aid
const AidIndex = lazy(() => import('./pages/aid/Index'))
const Beneficiaries = lazy(() => import('./pages/aid/Beneficiaries'))
const BeneficiariesDetail = lazy(() => import('./pages/aid/BeneficiariesDetail'))
const Reports = lazy(() => import('./pages/aid/Reports'))
const Applications = lazy(() => import('./pages/aid/Applications'))
const CashVault = lazy(() => import('./pages/aid/CashVault'))
const BankOrders = lazy(() => import('./pages/aid/BankOrders'))
const CashOperations = lazy(() => import('./pages/aid/CashOperations'))
const InKindOperations = lazy(() => import('./pages/aid/InKindOperations'))
const ServiceTracking = lazy(() => import('./pages/aid/ServiceTracking'))
const HospitalReferrals = lazy(() => import('./pages/aid/HospitalReferrals'))
const Parameters = lazy(() => import('./pages/aid/Parameters'))
const DataControl = lazy(() => import('./pages/aid/DataControl'))
const ModuleInfo = lazy(() => import('./pages/aid/ModuleInfo'))

// Fund
const FundMovements = lazy(() => import('./pages/fund/FundMovements'))
const CompleteReport = lazy(() => import('./pages/fund/CompleteReport'))
const FundRegions = lazy(() => import('./pages/fund/FundRegions'))
const WorkAreas = lazy(() => import('./pages/fund/WorkAreas'))
const FundDefinitions = lazy(() => import('./pages/fund/FundDefinitions'))
const ActivityDefinitions = lazy(() => import('./pages/fund/ActivityDefinitions'))
const SourcesExpenses = lazy(() => import('./pages/fund/SourcesExpenses'))
const AidCategories = lazy(() => import('./pages/fund/AidCategories'))

// System
const WarningMessages = lazy(() => import('./pages/system/WarningMessages'))
const StructuralControls = lazy(() => import('./pages/system/StructuralControls'))
const LocalIPs = lazy(() => import('./pages/system/LocalIPs'))
const IPBlocking = lazy(() => import('./pages/system/IPBlocking'))
const UserManagement = lazy(() => import('./pages/system/UserManagement'))

// Test Pages
const SentryTest = lazy(() => import('./pages/SentryTest'))

// Demo Pages
const RelatedRecordsDemo = lazy(() => import('./pages/demo/RelatedRecordsDemo'))

// Meetings
const MeetingsIndex = lazy(() => import('./pages/meetings/Index'))

// Internal Messages
const InternalMessagesIndex = lazy(() => import('./pages/internal-messages/Index'))

// Tasks
const TasksIndex = lazy(() => import('./pages/tasks/Index'))

// Definitions
const DefinitionsIndex = lazy(() => import('./pages/Definitions'))
const UnitRoles = lazy(() => import('./pages/definitions/UnitRoles'))
const Units = lazy(() => import('./pages/definitions/Units'))
const UserAccounts = lazy(() => import('./pages/definitions/UserAccounts'))
const PermissionGroupsClean = lazy(() => import('./pages/definitions/PermissionGroupsClean'))
const Buildings = lazy(() => import('./pages/definitions/Buildings'))
const InternalLines = lazy(() => import('./pages/definitions/InternalLines'))
const ProcessFlows = lazy(() => import('./pages/definitions/ProcessFlows'))
const PassportFormats = lazy(() => import('./pages/definitions/PassportFormats'))
const CountriesCities = lazy(() => import('./pages/definitions/CountriesCities'))
const InstitutionTypes = lazy(() => import('./pages/definitions/InstitutionTypes'))
const InstitutionStatus = lazy(() => import('./pages/definitions/InstitutionStatus'))
const DonationMethods = lazy(() => import('./pages/definitions/DonationMethods'))
const DeliveryTypes = lazy(() => import('./pages/definitions/DeliveryTypes'))
const MeetingRequests = lazy(() => import('./pages/definitions/MeetingRequests'))
const GSMCodes = lazy(() => import('./pages/definitions/GSMCodes'))
const InterfaceLanguages = lazy(() => import('./pages/definitions/InterfaceLanguages'))
const Translations = lazy(() => import('./pages/definitions/Translations'))
const GeneralSettings = lazy(() => import('./pages/definitions/GeneralSettings'))
const DefinitionsModuleInfo = lazy(() => import('./pages/definitions/ModuleInfo'))

function AppRoutes() {
  return (
    <Routes>
      {/* Login route */}
      <Route path="/login" element={<Login />} />
      
      {/* Dashboard */}
      <Route path="/" element={
        <ProtectedRoute>
          {withDashboardSuspense(DashboardIndex)}
        </ProtectedRoute>
      } />
      
      {/* Donations routes */}
      <Route path="/donations" element={
        <ProtectedRoute>
          {withDonationsSuspense(DonationsList)}
        </ProtectedRoute>
      } />
      <Route path="/donations/vault" element={
        <ProtectedRoute>
          {withDonationsSuspense(DonationVault)}
        </ProtectedRoute>
      } />
      <Route path="/donations/institutions" element={
        <ProtectedRoute>
          {withDonationsSuspense(Institutions)}
        </ProtectedRoute>
      } />
      <Route path="/donations/cash" element={
        <ProtectedRoute>
          {withDonationsSuspense(CashDonations)}
        </ProtectedRoute>
      } />
      <Route path="/donations/bank" element={
        <ProtectedRoute>
          {withDonationsSuspense(BankDonations)}
        </ProtectedRoute>
      } />
      <Route path="/donations/credit-card" element={
        <ProtectedRoute>
          {withDonationsSuspense(CreditCardDonations)}
        </ProtectedRoute>
      } />
      <Route path="/donations/online" element={
        <ProtectedRoute>
          {withDonationsSuspense(OnlineDonations)}
        </ProtectedRoute>
      } />
      <Route path="/donations/numbers" element={
        <ProtectedRoute>
          {withDonationsSuspense(DonationNumbers)}
        </ProtectedRoute>
      } />
      <Route path="/donations/funding-definitions" element={
        <ProtectedRoute>
          {withDonationsSuspense(FundingDefinitions)}
        </ProtectedRoute>
      } />
      <Route path="/donations/sacrifice-periods" element={
        <ProtectedRoute>
          {withDonationsSuspense(SacrificePeriods)}
        </ProtectedRoute>
      } />
      <Route path="/donations/sacrifice-shares" element={
        <ProtectedRoute>
          {withDonationsSuspense(SacrificeShares)}
        </ProtectedRoute>
      } />
      <Route path="/donations/ramadan-periods" element={
        <ProtectedRoute>
          {withDonationsSuspense(RamadanPeriods)}
        </ProtectedRoute>
      } />
      <Route path="/donations/piggy-bank" element={
        <ProtectedRoute>
          {withDonationsSuspense(PiggyBankTracking)}
        </ProtectedRoute>
      } />
      <Route path="/donations/bulk-provisioning" element={
        <ProtectedRoute>
          {withDonationsSuspense(BulkProvisioning)}
        </ProtectedRoute>
      } />
      
      {/* Messages routes */}
      <Route path="/messages" element={
        <ProtectedRoute>
          {withMessagesSuspense(MessagesIndex)}
        </ProtectedRoute>
      } />
      <Route path="/messages/bulk-send" element={
        <ProtectedRoute>
          {withMessagesSuspense(BulkSend)}
        </ProtectedRoute>
      } />
      <Route path="/messages/groups" element={
        <ProtectedRoute>
          {withMessagesSuspense(Groups)}
        </ProtectedRoute>
      } />
      <Route path="/messages/templates" element={
        <ProtectedRoute>
          {withMessagesSuspense(Templates)}
        </ProtectedRoute>
      } />
      <Route path="/messages/sms-deliveries" element={
        <ProtectedRoute>
          {withMessagesSuspense(SmsDeliveries)}
        </ProtectedRoute>
      } />
      <Route path="/messages/email-deliveries" element={
        <ProtectedRoute>
          {withMessagesSuspense(EmailDeliveries)}
        </ProtectedRoute>
      } />
      <Route path="/messages/analytics" element={
        <ProtectedRoute>
          {withMessagesSuspense(Analytics)}
        </ProtectedRoute>
      } />
      <Route path="/messages/module-info" element={
        <ProtectedRoute>
          {withMessagesSuspense(MessageModuleInfo)}
        </ProtectedRoute>
      } />
      
      {/* Scholarship routes */}
      <Route path="/scholarship/orphans-students" element={
        <ProtectedRoute>
          {withScholarshipSuspense(OrphansStudents)}
        </ProtectedRoute>
      } />
      <Route path="/scholarship/reports" element={
        <ProtectedRoute>
          {withScholarshipSuspense(ScholarshipReports)}
        </ProtectedRoute>
      } />
      
      {/* Aid routes */}
      <Route path="/aid" element={
        <ProtectedRoute>
          {withAidSuspense(AidIndex)}
        </ProtectedRoute>
      } />
      <Route path="/aid/beneficiaries" element={
        <ProtectedRoute>
          {withAidSuspense(Beneficiaries)}
        </ProtectedRoute>
      } />
      <Route path="/aid/beneficiaries/:id" element={
        <ProtectedRoute>
          {withAidSuspense(BeneficiariesDetail)}
        </ProtectedRoute>
      } />
      <Route path="/aid/reports" element={
        <ProtectedRoute>
          {withAidSuspense(Reports)}
        </ProtectedRoute>
      } />
      <Route path="/aid/applications" element={
        <ProtectedRoute>
          {withAidSuspense(Applications)}
        </ProtectedRoute>
      } />
      <Route path="/aid/cash-vault" element={
        <ProtectedRoute>
          {withAidSuspense(CashVault)}
        </ProtectedRoute>
      } />
      <Route path="/aid/bank-orders" element={
        <ProtectedRoute>
          {withAidSuspense(BankOrders)}
        </ProtectedRoute>
      } />
      <Route path="/aid/cash-operations" element={
        <ProtectedRoute>
          {withAidSuspense(CashOperations)}
        </ProtectedRoute>
      } />
      <Route path="/aid/in-kind-operations" element={
        <ProtectedRoute>
          {withAidSuspense(InKindOperations)}
        </ProtectedRoute>
      } />
      <Route path="/aid/service-tracking" element={
        <ProtectedRoute>
          {withAidSuspense(ServiceTracking)}
        </ProtectedRoute>
      } />
      <Route path="/aid/hospital-referrals" element={
        <ProtectedRoute>
          {withAidSuspense(HospitalReferrals)}
        </ProtectedRoute>
      } />
      <Route path="/aid/parameters" element={
        <ProtectedRoute>
          {withAidSuspense(Parameters)}
        </ProtectedRoute>
      } />
      <Route path="/aid/data-control" element={
        <ProtectedRoute>
          {withAidSuspense(DataControl)}
        </ProtectedRoute>
      } />
      <Route path="/aid/module-info" element={
        <ProtectedRoute>
          {withAidSuspense(ModuleInfo)}
        </ProtectedRoute>
      } />
      
      {/* Fund routes */}
      <Route path="/fund/movements" element={
        <ProtectedRoute>
          {withFundSuspense(FundMovements)}
        </ProtectedRoute>
      } />
      <Route path="/fund/complete-report" element={
        <ProtectedRoute>
          {withFundSuspense(CompleteReport)}
        </ProtectedRoute>
      } />
      <Route path="/fund/regions" element={
        <ProtectedRoute>
          {withFundSuspense(FundRegions)}
        </ProtectedRoute>
      } />
      <Route path="/fund/work-areas" element={
        <ProtectedRoute>
          {withFundSuspense(WorkAreas)}
        </ProtectedRoute>
      } />
      <Route path="/fund/definitions" element={
        <ProtectedRoute>
          {withFundSuspense(FundDefinitions)}
        </ProtectedRoute>
      } />
      <Route path="/fund/activity-definitions" element={
        <ProtectedRoute>
          {withFundSuspense(ActivityDefinitions)}
        </ProtectedRoute>
      } />
      <Route path="/fund/sources-expenses" element={
        <ProtectedRoute>
          {withFundSuspense(SourcesExpenses)}
        </ProtectedRoute>
      } />
      <Route path="/fund/aid-categories" element={
        <ProtectedRoute>
          {withFundSuspense(AidCategories)}
        </ProtectedRoute>
      } />
      
      {/* System routes */}
      <Route path="/system/warning-messages" element={
        <ProtectedRoute>
          {withSystemSuspense(WarningMessages)}
        </ProtectedRoute>
      } />
      <Route path="/system/structural-controls" element={
        <ProtectedRoute>
          {withSystemSuspense(StructuralControls)}
        </ProtectedRoute>
      } />
      <Route path="/system/local-ips" element={
        <ProtectedRoute>
          {withSystemSuspense(LocalIPs)}
        </ProtectedRoute>
      } />
      <Route path="/system/ip-blocking" element={
        <ProtectedRoute>
          {withSystemSuspense(IPBlocking)}
        </ProtectedRoute>
      } />
      <Route path="/system/user-management" element={
        <ProtectedRoute>
          {withSystemSuspense(UserManagement)}
        </ProtectedRoute>
      } />
      
      {/* Definitions routes */}
      <Route path="/definitions" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(DefinitionsIndex)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/unit-roles" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(UnitRoles)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/units" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(Units)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/user-accounts" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(UserAccounts)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/permission-groups" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(PermissionGroupsClean)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/buildings" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(Buildings)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/internal-lines" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(InternalLines)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/process-flows" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(ProcessFlows)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/passport-formats" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(PassportFormats)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/countries-cities" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(CountriesCities)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/institution-types" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(InstitutionTypes)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/institution-status" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(InstitutionStatus)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/donation-methods" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(DonationMethods)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/delivery-types" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(DeliveryTypes)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/meeting-requests" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(MeetingRequests)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/gsm-codes" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(GSMCodes)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/interface-languages" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(InterfaceLanguages)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/translations" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(Translations)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/general-settings" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(GeneralSettings)}
        </ProtectedRoute>
      } />
      <Route path="/definitions/module-info" element={
        <ProtectedRoute>
          {withDefinitionsSuspense(DefinitionsModuleInfo)}
        </ProtectedRoute>
      } />
      
      {/* Meetings */}
      <Route path="/meetings" element={
        <ProtectedRoute>
          {withMeetingsSuspense(MeetingsIndex, 'dashboard')}
        </ProtectedRoute>
      } />
      
      {/* Internal Messages */}
      <Route path="/internal-messages" element={
        <ProtectedRoute>
          {withInternalMessagesSuspense(InternalMessagesIndex, 'dashboard')}
        </ProtectedRoute>
      } />
      
      {/* Tasks */}
      <Route path="/tasks" element={
        <ProtectedRoute>
          {withTasksSuspense(TasksIndex, 'dashboard')}
        </ProtectedRoute>
      } />
      
      {/* Test routes */}
      <Route path="/sentry-test" element={
        <ProtectedRoute>
          {withSystemSuspense(SentryTest)}
        </ProtectedRoute>
      } />
      <Route path="/supabase-test" element={
        <ProtectedRoute>
          {withSystemSuspense(SupabaseTest)}
        </ProtectedRoute>
      } />
      <Route path="/demo/related-records" element={
        <ProtectedRoute>
          {withSystemSuspense(RelatedRecordsDemo)}
        </ProtectedRoute>
      } />

      
      {/* Catch-all route for 404 errors */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default AppRoutes
