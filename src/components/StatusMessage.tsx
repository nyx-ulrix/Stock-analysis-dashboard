// =============================================================================
// STATUS MESSAGE COMPONENT
// =============================================================================
// This component displays status messages and feedback to the user.
// It's a simple, reusable component that shows messages from various
// operations like file uploads, analysis progress, and error states.
//
// Key responsibilities:
// - Displaying status messages to the user
// - Handling empty/null messages gracefully
// - Providing consistent styling for all status messages
// - Supporting different types of messages (success, error, info)

/**
 * Props interface for the StatusMessage component
 */
interface StatusMessageProps {
  message: string  // The status message to display (empty string means no message)
}

/**
 * StatusMessage component that displays user feedback messages
 * 
 * This component:
 * - Only renders when a message is provided (returns null if empty)
 * - Displays the message in a styled container
 * - Uses consistent styling for all status messages
 * 
 * @param props - Component props containing the message to display
 */
export function StatusMessage({ message }: StatusMessageProps) {
  // Don't render anything if there's no message
  if (!message) return null

  return (
    <div className="text-sm p-3 bg-gray-700 rounded">
      {message}
    </div>
  )
}
