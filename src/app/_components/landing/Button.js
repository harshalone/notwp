export default function Button({ children, variant = "default", size = "default", className = "", ...props }) {
  const baseStyles = "inline-flex items-center justify-center rounded-lg font-medium transition-colors"
  const variants = {
    default: "bg-foreground text-background hover:bg-foreground/90",
    outline: "border border-border hover:bg-muted/50"
  }
  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-sm",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
