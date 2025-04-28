import { motion } from "framer-motion"

export const BallLoader = () => {
  return (
    <div className="loader">
      {[0, 1, 2].map((index) => (
        <motion.div
          key={index}
          className="loader__ball"
          animate={{
            y: [-8, 8]
          }}
          transition={{
            duration: 0.5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
            delay: index * 0.15 // Creates wave effect
          }}
        />
      ))}
    </div>
  )
}