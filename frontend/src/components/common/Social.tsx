import { Link } from "react-router-dom"
import InjectableSvg from "../../hooks/InjectableSvg"
import { buildWhatsAppUrl } from "../../utils/whatsapp"

const Social = () => {
   return (
      <>
         <li>
            <Link to="https://www.facebook.com/" target="_blank">
               <InjectableSvg src="/assets/img/icons/facebook.svg" alt="img" className="injectable" />
            </Link>
         </li>
         <li>
            <Link to="https://twitter.com/" target="_blank">
               <InjectableSvg src="/assets/img/icons/twitter.svg" alt="img" className="injectable" />
            </Link>
         </li>
         <li>
            <Link to={buildWhatsAppUrl("917838416907")} target="_blank">
               <InjectableSvg src="/assets/img/icons/whatsapp.svg" alt="img" className="injectable" />
            </Link>
         </li>
         <li>
            <Link to="https://www.instagram.com/gdp_garimadanceproductions?igsh=MWhueGpqZGQzZGN0ZA==" target="_blank">
               <InjectableSvg src="/assets/img/icons/instagram.svg" alt="img" className="injectable" />
            </Link>
         </li>
         <li>
            <Link to="https://youtube.com/@garimadanceproductions1146?si=XEMV40bqEVW6JM71" target="_blank">
               <InjectableSvg src="/assets/img/icons/youtube.svg" alt="img" className="injectable" />
            </Link>
         </li>
      </>
   )
}

export default Social

