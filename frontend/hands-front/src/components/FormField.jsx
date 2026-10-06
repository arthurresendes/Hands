export default function FormField({ label, type = 'text', placeholder, Icon }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-[#1F2937] mb-2">{label}</label>
      <div className="relative">
        {Icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
            <Icon />
          </span>
        )}
        <input
          type={type}
          placeholder={placeholder}
          readOnly
          className={`w-full ${Icon ? 'pl-11' : 'pl-4'} pr-4 py-3.5 border border-gray-200 rounded-xl outline-none text-sm placeholder-gray-400 focus:border-[#5B2EFF] transition-colors`}
        />
      </div>
    </div>
  )
}
