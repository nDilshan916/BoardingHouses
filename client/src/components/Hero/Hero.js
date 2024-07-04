import "./Hero.css";
import CountUp from "react-countup";
import { motion } from "framer-motion";
// import SearchBar from "../SearchBar/SearchBar";
const Hero = () => {
  return (
    <section className="hero-wrapper">
      <div className="paddings innerWidth flexCenter hero-container">
        {/* left side */}
        <div className="flexColStart hero-left">
          <div className="hero-title">
            <div className="orange-circle" />
            <motion.h1
              initial={{ y: "2rem", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{
                duration: 2,
                type: "ease-in",
              }}
            >
              Discover <br />
              Most Suitable
              <br />
              Boarding House
            </motion.h1>
          </div>
          <div className="flexColStart secondaryText flexhero-des">
            <span>Stay connected, stay informed. </span>
            <span> Your boarding world at your fingertips.</span>
          </div>

          {/* <SearchBar /> */}

          <div className="flexCenter stats">
            <div className="flexColCenter stat">
              <span>
                <CountUp start={80} end={100} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Boarding Houses</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp start={40} end={50} duration={4} /> <span>+</span>
              </span>
              <span className="secondaryText">Happy Customers</span>
            </div>

            <div className="flexColCenter stat">
              <span>
                <CountUp end={10} /> <span>+</span>
              </span>
              <span className="secondaryText">Universities</span>
            </div>
          </div>
        </div>

        {/* right side */}
        <div className="flexCenter hero-right">
          <motion.div
            initial={{ x: "7rem", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 2,
              type: "ease-in",
            }}
            className="image-container"
          >
            <img src="./Hero-Boarding1.jpg" alt="houses" />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
