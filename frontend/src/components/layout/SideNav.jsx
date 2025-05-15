import { Link } from "react-router-dom"


function SideNav() {
    return(
        <>
            <div class="flex">
                <nav class = "flex flex-col justify-around items-end bg-dark_green">
                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/account">Account</Link>
                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/dashboard">Dashboard</Link>
                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/trade">Trading</Link>
                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/recent">Recent Trades</Link>
                    <Link class = "flex p-2 m-1 rounded bg-transparent text-stone_ish hover:text-sand_stone" to = "/admin">Admin</Link>
                </nav>
            </div>
        </>
    )
}

export default SideNav