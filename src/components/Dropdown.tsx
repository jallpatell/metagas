import React from 'react'

type DropdownProps = {
    options: string[];
    selected: string;
    onChange: (value: string) => void
}
const options = ["Ethereum MainNet Gas", "Polygon Labs Gas", "Arbitrum"]
const selected = options[0]

const Dropdown: React.FC<DropdownProps> = ({ options, selected, onChange }) => {

  return (
    <select
        value={selected} onChange={(e) => onChange(e.target.value)}
    >
        { options.map((option) => (
            <option key={option} value={option} >
                { option }
            </option>
        ))}
    </select>
  )
}

export default Dropdown