import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-200 py-4 mt-24">
      <div
        className="container mx-auto flex flex-col md:flex-row items-center justify-between px-4"
      >
        <div className="mb-4 md:mb-0">
        </div>
        <div
          className="flex flex-wrap justify-center md:justify-start mb-4 md:mb-0"
        >
          <ul className="flex space-x-12">
            <li>
                <Link href="/properties">Properties</Link>
            </li>
            <li>
                <Link href="/terms">Terms of Service</Link>
            </li>
          </ul>
          
        </div>
        
        <div>
      
        </div>
        
      </div>
      <p className="text-sm text-gray-500 md:my-4 text-center w-full">
            &copy; {currentYear} Live World. Made by Umit Vice.
        </p>
    </footer>
  )
}

export default Footer;