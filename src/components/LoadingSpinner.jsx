const LoadingSpinner = ({ size = "large", text = "Chargement..." }) => {
  const sizeClasses = {
    small: "w-6 h-6",
    medium: "w-8 h-8", 
    large: "w-12 h-12"
  }

  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="relative">
        {/* Spinner principal */}
        <div className={`${sizeClasses[size]} border-4 border-violet-200 border-t-violet-500 rounded-full animate-spin`}></div>
        
        {/* Effet de lueur */}
        <div className={`absolute inset-0 ${sizeClasses[size]} border-4 border-transparent border-t-purple-400 rounded-full animate-spin`} style={{ animationDirection: 'reverse', animationDuration: '1.5s' }}></div>
      </div>
      
      {text && (
        <p className="mt-4 text-slate-600 font-medium animate-pulse">{text}</p>
      )}
    </div>
  )
}

export default LoadingSpinner
