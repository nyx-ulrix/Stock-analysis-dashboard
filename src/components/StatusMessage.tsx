// =============================================================================
// STATUS MESSAGE COMPONENT
// =============================================================================


interface StatusMessageProps {
  message: string
}

export function StatusMessage({ message }: StatusMessageProps) {
  if (!message) return null

  return (
    <div className="text-sm p-3 bg-gray-700 rounded">
      {message}
    </div>
  )
}
