import { IPropsCustomInputsFormRegister } from "@src/pages/login/Login";

export default function CustomInputText({ form, handleChange }: IPropsCustomInputsFormRegister) {
    return (
        <>
            <label className='font-bold text-stone-800' htmlFor="name">
                Name:
            </label>
            <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="text-black mt-1 sm:placeholder:opacity-100 placeholder:opacity-0 w-full h-8 md:h-10 px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-dark-green focus:border-dark-green-hover transition duration-200 ease-in-out"
            />
        </>
    );
}
