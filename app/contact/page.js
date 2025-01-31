import ContactForm from "../components/ContactForm"; // Importation du composant ContactForm

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      {/* Titre de la page */}
      <h1 className="text-3xl font-bold text-center mb-6">Contactez-moi</h1>
      
      {/* Texte d'introduction */}
      <p className="text-lg text-center mb-4">
        Vous pouvez me contacter via ce formulaire ou sur mes réseaux sociaux.
      </p>
      
      {/* Liens vers les réseaux sociaux */}
      <div className="flex justify-center space-x-4 mb-6">
        <a href="https://linkedin.com/in/votreprofil" className="text-blue-500">LinkedIn</a>
        <a href="https://twitter.com/votreprofil" className="text-blue-500">Twitter</a>
        <a href="mailto:votre@email.com" className="text-blue-500">Email</a>
      </div>

      {/* Formulaire de contact */}
      <ContactForm />
    </div>
  );
}