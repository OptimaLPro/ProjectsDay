import { AnimatePresence, motion } from "framer-motion";
import CardItem from "./CardItem";

const Cards = ({ projects }) => {
  return (
    <AnimatePresence>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {projects.map((project) => (
          <motion.div
            key={project._id}
            href={project.link}
            className="group"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <CardItem project={project} />
          </motion.div>
        ))}
      </div>
    </AnimatePresence>
  );
};

export default Cards;
