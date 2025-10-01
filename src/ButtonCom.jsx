import React from 'react'

function ButtonCom(props) {
    return (
        <div>
            <button
                className='px-4 py-1 fw-bold text-uppercase rounded-3 adminbtn shadow'
                onClick={props.onClick}
            >
                <span>{props.btn}</span>
            </button>
        </div>
    )
}

export default ButtonCom