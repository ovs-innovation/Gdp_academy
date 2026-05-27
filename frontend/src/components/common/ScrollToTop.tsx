import UseSticky from "../../hooks/UseSticky";

const ScrollToTop = () => {
   const { sticky }: { sticky: boolean } = UseSticky();

   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   return (
      <>
         <button onClick={scrollTop} className={`scroll__top scroll-to-target ${sticky ? "open" : ""}`} data-target="html">
            <i className="tg-flaticon-arrowhead-up"></i>
         </button>
      </>
   )
}

export default ScrollToTop;
