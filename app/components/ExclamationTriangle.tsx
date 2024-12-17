type Props = {
  backgroundColor: string
  stroke?: string
  className?: string
}

function ExclamationTriangle({ backgroundColor, className, stroke = 'white' }: Props) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M7.26795 3C8.03775 1.66667 9.96225 1.66667 10.7321 3L16.7942 13.5C17.564 14.8333 16.6018 16.5 15.0622 16.5H2.93782C1.39822 16.5 0.435971 14.8333 1.20577 13.5L7.26795 3Z"
        fill={backgroundColor}
        stroke={stroke}
      />
      <path
        d="M9.94815 5.27273L9.78196 11.3835H8.2223L8.05185 5.27273H9.94815ZM9.00213 14.1108C8.72088 14.1108 8.4794 14.0114 8.2777 13.8125C8.07599 13.6108 7.97656 13.3693 7.9794 13.0881C7.97656 12.8097 8.07599 12.571 8.2777 12.3722C8.4794 12.1733 8.72088 12.0739 9.00213 12.0739C9.27202 12.0739 9.50923 12.1733 9.71378 12.3722C9.91832 12.571 10.022 12.8097 10.0249 13.0881C10.022 13.2756 9.9723 13.4474 9.87571 13.6037C9.78196 13.7571 9.65838 13.8807 9.50497 13.9744C9.35156 14.0653 9.18395 14.1108 9.00213 14.1108Z"
        fill={stroke}
      />
    </svg>
  )
}

export default ExclamationTriangle
