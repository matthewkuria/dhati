import { lusitana } from "./fonts"
export default function Logo(){
    return(
        <h1 className={`${lusitana.className} font-bold text-white md:text-2xl`}>
            NCMI
        </h1>
    )
}