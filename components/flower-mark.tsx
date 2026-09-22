export function FlowerMark({ className = "" }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={"text-vigil " + className} viewBox="-8 -8 16 16" fill="none">
      <g fill="currentColor">
        {Array.from({ length: 8 }, (_, index) => (
          <ellipse key={index} cx="0" cy="-4.2" rx="1.55" ry="2.5" transform={`rotate(${index * 45})`} />
        ))}
        <circle r="1.45" />
      </g>
    </svg>
  )
}
