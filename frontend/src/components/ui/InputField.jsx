function InputField(props) {
    return (
            <input
                {...props}
                className="w-full py-[10px] px-4 bg-white border border-teeming-border rounded-lg text-[14px] text-teeming-text-dark placeholder-teeming-light-gray focus:outline-none focus:ring-1 focus:ring-teeming-green focus:border-teeming-green transition-all"
            />
    )
}

export default InputField