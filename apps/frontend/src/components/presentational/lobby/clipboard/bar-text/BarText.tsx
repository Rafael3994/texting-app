import { useState } from "react"
import sendSVG from '@src/assets/send.svg'

export default function BarText() {

    const [textValue, setTextValue] = useState<string>('')

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        if (!textValue) return
        console.log('Send:', textValue);
        
        setTextValue('')
    }

    return (
        <div className="bg-color-sidebar h-20 w-full">
            <form onSubmit={handleSubmit} className="h-full w-full flex flex-row items-center justify-center">
                <input
                    type="text"
                    value={textValue}
                    onChange={(e) => {
                        setTextValue(e.target.value)
                    }}
                    className="h-10 w-4/6 py-2 rounded-xl bg-item-menu-selected border-[1px] border-clipboard-background
                                px-4 focus:outline-none focus:ring-[1px] focus:ring-dark-green focus:border-dark-green-hover transition duration-200 ease-in-out
                                "
                />
                <div className='h-12 w-12 ml-7 hover:cursor-pointer hover:bg-menu-chats-background hover:border hover:border-[#ffffff53] hover:shadow-white hover:rounded-full'>
                    <button className='h-full w-full flex justify-center items-center pl-1'>
                        <img src={sendSVG} alt="send-message" className='h-12 w-12' />
                    </button>
                </div>
            </form>
        </div>
    )
}