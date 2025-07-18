import React from "react";

function Loader({ className = "" }) {
  return (
    <svg
      className={className}
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
    >
      <g>
        <rect x="11" y="0.5" width="2.5" height="5.5" opacity=".14" />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(30 12 12)"
          opacity=".29"
        />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(60 12 12)"
          opacity=".43"
        />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(90 12 12)"
          opacity=".57"
        />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(120 12 12)"
          opacity=".71"
        />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(150 12 12)"
          opacity=".86"
        />
        <rect
          x="11"
          y="0.5"
          width="2.5"
          height="5.5"
          transform="rotate(180 12 12)"
        />
        <animateTransform
          attributeName="transform"
          type="rotate"
          calcMode="discrete"
          dur="0.75s"
          values="0 12 12;30 12 12;60 12 12;90 12 12;120 12 12;150 12 12;180 12 12;210 12 12;240 12 12;270 12 12;300 12 12;330 12 12;360 12 12"
          repeatCount="indefinite"
        />
      </g>
    </svg>
  );
}

export default Loader;
