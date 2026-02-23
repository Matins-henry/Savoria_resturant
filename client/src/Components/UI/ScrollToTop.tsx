import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Delay slightly to wait for the mount and possible transitions
        const timer = setTimeout(() => {
            window.scrollTo({
                top: 0,
                left: 0,
                behavior: "instant", // Using instant to ensure next page starts clean
            });
        }, 10);

        return () => clearTimeout(timer);
    }, [pathname]);

    return null;
}
