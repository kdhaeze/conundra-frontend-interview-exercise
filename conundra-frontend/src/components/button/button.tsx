import { MouseEventHandler } from 'react'
import './button.scss'
interface Props {
    text: string,
    toggleSidebar: MouseEventHandler
}

const SidebarButton: React.FC<Props> = ({text, toggleSidebar}) => {
    return (
        <button className="sidebar-button" onClick={toggleSidebar}>
            {text}
        </button>
    )
}

export default SidebarButton
