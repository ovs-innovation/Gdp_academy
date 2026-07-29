import { useEffect } from "react";
import { ToastContainer } from "react-toastify";
import AOS from "aos";
import MotionAnimation from "../hooks/MotionAnimation";
import ScrollToTop from "../components/common/ScrollToTop";

interface WrapperProps {
    children: React.ReactNode;
}

const Wrapper = ({ children }: WrapperProps) => {

    useEffect(() => {
        AOS.init({
            once: true,
            duration: 650,
            easing: "ease-out-cubic",
            offset: 40,
            disable: window.matchMedia("(prefers-reduced-motion: reduce)").matches
                ? true
                : "phone",
        });
    }, []);

    MotionAnimation();

    return (
        <>
            {children}
            <ScrollToTop />
            <ToastContainer position="top-center" />
        </>
    );
}

export default Wrapper;
