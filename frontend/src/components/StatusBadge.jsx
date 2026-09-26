const statusStyles = {
  Draft: 'bg-gray-100 text-gray-600',
  Waiting: 'bg-amber-50 text-amber-600',
  Ready: 'bg-blue-50 text-blue-700',
  Done: 'bg-green-50 text-green-700',
  Canceled: 'bg-red-50 text-red-600',
}

export default function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium ${statusStyles[status] || 'bg-gray-100 text-gray-600'}`}>
      {status}
    </span>
  )
}