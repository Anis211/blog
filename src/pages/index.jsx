import Hero from "@/components/Home/Hero";
import About from "@/components/Home/About";
import Example from "@/components/Home/Example";
import Cost from "@/components/Home/Cost";
import Links from "@/components/Home/Links";
import { useInView } from "framer-motion";
import { useRef, useEffect } from "react";
import useUser from "@/zustand/users";

export default function Home() {
  useEffect(() => {
    useUser.persist.rehydrate();
  }, []);

  const ref = useRef(null);
  const inView = useInView(ref, { once: true });

  const user = useUser((state) => state.user);

  return (
    <>
      <Hero />
      <div ref={ref} id="about" />
      <About />
      <Example />
      <div id="cost" />
      {(user.email != "admin@mail.ru" && user.subscribed == false) ||
      (user.email != "admin@mail.ru" && user.subscribed == undefined) ? (
        <Cost />
      ) : (
        ""
      )}
      <Links inView={inView} />
    </>
  );
}
