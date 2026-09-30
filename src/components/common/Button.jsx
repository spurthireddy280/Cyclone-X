import React from 'react';

export default function Button({
  children,
  variant = 'primary', // 'primary' | 'secondary' | 'danger' | 'ghost'
  size = 'md',        // 'sm' | 'md' | 'lg'
  icon: Icon,
  iconRight: IconRight,
  isLoading = false,
  loadingText,
  disabled = false,
  onClick,
  className = "",
  type = "button",
  id,
  style = {}
}) {
  const sizeClass = size === 'sm' ? 'btn-sm' : size === 'lg' ? 'btn-lg' : '';
  const variantClass = `btn-${variant}`;

  return (
    <button
      type={type}
      id={id}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={`btn ${variantClass} ${sizeClass} ${className}`}
      style={style}
    >
      {isLoading ? (
        <>
          <span
            style={{
              width: 14,
              height: 14,
              border: '2px solid currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              display: 'inline-block',
              animation: 'spin 0.8s linear infinite'
            }}
          />
          <span>{loadingText || children}</span>
        </>
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
          <span>{children}</span>
          {IconRight && <IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} />}
        </>
      )}
    </button>
  );
}
