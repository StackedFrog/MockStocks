import { Link } from "react-router-dom"


function SideNav() {
    return(
        <>
            <nav className = "flex flex-col justify-around max-h-full bg-dark_green">
                <Link className = "p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/account">Account</Link>
                <Link className = "p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/trading">Trading</Link>
                <Link className = "p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/recent">Recent Trades</Link>
            </nav>
        </>
    )
}

export default SideNav