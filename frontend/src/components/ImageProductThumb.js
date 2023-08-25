import React from 'react';

export default function ImageProductThumb(props) {
   return (
      <div>
         <img
            src={props.src}
            alt={props.alt}
            height={props.height}
            width={props.width}
            className="img-fluid rounded img-thumbnail"
         ></img>
      </div>
   );
}
