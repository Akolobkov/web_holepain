
function ShortButton ({text, color, width_ , height_}){
    return (
        <button
        style={{ backgroundColor: color, width: width_, height: height_, fontSize: 9 , marginRight: 5
         }}
        >
            {text}
        </button>
    );
}

export default ShortButton;