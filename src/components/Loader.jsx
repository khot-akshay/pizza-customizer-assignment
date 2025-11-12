const Loader = ({ label = 'Loading...' }) => (
  <div
    role="status"
    aria-live="polite"
    className="flex flex-col items-center justify-center gap-3 py-12"
  >
    <span className="h-12 w-12 animate-spin rounded-full border-4 border-brand/20 border-t-brand" />
    <p className="text-sm font-medium text-slate-600">{label}</p>
  </div>
)

export default Loader


