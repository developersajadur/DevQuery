import Image from "next/image";
import { FaFacebook, FaLinkedin, FaGithub, FaWhatsapp } from "react-icons/fa";
import { HiMail } from "react-icons/hi";

const AboutUs = () => {
    const teamMembers = [
        {
          name: "Ashraful Islam",
          role: "Team Leader | Front-End Developer",
          description:
            "Our team leader ensures we stay on the cutting edge of front-end technologies, guiding us to achieve outstanding results in every project. With a focus on continuous learning and innovation, they lead the way in tackling challenges and setting new standards.",
          image: "https://i.ibb.co.com/R0gn6Yy/IMG-20240901-210841-1.jpg", // Replace with actual image path
          socialLinks: {
            facebook: "https://facebook.com/teamleader",
            whatsapp: "https://wa.me/1234567890", // Replace with actual WhatsApp number
            email: "mailto:teamleader@example.com",
            github: "https://github.com/teamleader",
            linkedin: "https://linkedin.com/in/teamleader",
          },
        },
        {
          name: "Sajadur Rahman",
          role: "Project Manager | MERN Stack Developer",
          description:
            "The project manager keeps our projects on track, ensuring smooth communication and timely delivery. They bridge the gap between client expectations and technical execution, making sure each task aligns with the bigger picture.",
          image: "https://i.ibb.co.com/QCHx2CT/Hi-I-am-Sajadur-Rahman-a-specializer-in-MERN-Stack-development-using-React-and-Nextjs-I-boast-profic.png", // Replace with actual image path
          socialLinks: {
            facebook: "https://web.facebook.com/developersajadur",
            whatsapp: "https://wa.me/+8801787448412", // Replace with actual WhatsApp number
            email: "mailto:itzmesojib@gmail.com",
            github: "https://github.com/developersajadur",
            linkedin: "https://www.linkedin.com/in/sajadurrahman",
          },
        },
        {
          name: "Anik Sajib Sarkar",
          role: "Front-End Developer",
          description:
            "With a knack for creating dynamic and responsive interfaces, this developer brings a keen eye for design and detail to every line of code. Their expertise in modern JavaScript frameworks and libraries helps transform complex ideas into engaging user experiences.",
          image: "https://i.ibb.co.com/MC722cc/download.png", // Replace with actual image path
          socialLinks: {
            facebook: "https://facebook.com/developer1",
            whatsapp: "https://wa.me/1122334455", // Replace with actual WhatsApp number
            email: "mailto:developer1@example.com",
            github: "https://github.com/developer1",
            linkedin: "https://linkedin.com/in/developer1",
          },
        },
        {
          name: "Iftikher Lutfur Abdullah",
          role: "Front-End Developer",
          description:
            "Specializing in crafting sleek and efficient front-end solutions, this developer focuses on optimizing performance and usability. Their commitment to clean code and best practices ensures our projects not only look great but perform exceptionally well.",
          image: "https://i.ibb.co.com/0Y1vWdW/428688173-1839088336553236-934983716275986268-n-2.jpg", // Replace with actual image path
          socialLinks: {
            facebook: "https://facebook.com/developer2",
            whatsapp: "https://wa.me/2233445566", // Replace with actual WhatsApp number
            email: "mailto:developer2@example.com",
            github: "https://github.com/developer2",
            linkedin: "https://linkedin.com/in/developer2",
          },
        },
      ];

  return (
    <section className="bg-gray-100 text-gray-900 py-16">
      <div className="container mx-auto px-8 text-center">
        {/* About Us Section */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold mb-4">About Us</h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto">
            We are a passionate team of four dedicated front-end developers,
            committed to creating seamless and user-friendly digital
            experiences. With diverse skills and a collaborative approach, we
            deliver high-quality web solutions that bring your ideas to life.
          </p>
        </div>

        {/* Team Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="bg-gray-200 rounded-2xl p-6 shadow-lg transform transition-transform hover:scale-105"
              style={{
                boxShadow: "8px 8px 16px #c5c5c5, -8px -8px 16px #ffffff",
              }}
            >
              <Image
                src={member.image}
                alt={member.name}
                width={400}
                height={400}
                className="w-24 h-24 mx-auto rounded-full mb-4"
              />
              <h3 className="text-xl font-semibold mb-2">{member.name}</h3>
              <p className="text-sm font-light text-gray-600 mb-4">
                {member.role}
              </p>
              <p className="text-gray-500 mb-4">{member.description}</p>
              <div className="flex justify-center space-x-4 mt-4">
                {/* Social Media Icons */}
                <div className="flex space-x-2">
                  {member.socialLinks.facebook && (
                    <a
                      href={member.socialLinks.facebook}
                      className="neomorphic-icon"
                    >
                      <FaFacebook />
                    </a>
                  )}
                  {member.socialLinks.linkedin && (
                    <a
                      href={member.socialLinks.linkedin}
                      className="neomorphic-icon"
                    >
                      <FaLinkedin />
                    </a>
                  )}
                  {member.socialLinks.github && (
                    <a
                      href={member.socialLinks.github}
                      className="neomorphic-icon"
                    >
                      <FaGithub />
                    </a>
                  )}
                  {member.socialLinks.whatsapp && (
                    <a
                      href={member.socialLinks.whatsapp}
                      className="neomorphic-icon"
                    >
                      <FaWhatsapp />
                    </a>
                  )}
                  {member.socialLinks.email && (
                    <a
                      href={member.socialLinks.email}
                      className="neomorphic-icon"
                    >
                      <HiMail />
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AboutUs;
