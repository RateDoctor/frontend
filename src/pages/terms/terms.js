import React from "react";
import "./terms.css";

const TermsFr = () => {
  return (
    <div className="terms-container">
      <h1 className="terms-title">Conditions Générales d’Utilisation</h1>
      <p className="terms-update">
        <strong>Dernière mise à jour :</strong> 15 août 2025 — Version: 2025-08-15-v1
      </p>

      <section className="terms-section">
        <h2 className="terms-section-title">1. Objet de la Plateforme</h2>
        <p className="terms-text">
          Cette plateforme permet aux étudiants et diplômés d’évaluer les enseignants universitaires
          de manière constructive et objective, dans le but d’améliorer la qualité académique.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">2. Inscription</h2>
        <ul className="terms-list">
          <li>Vous devez fournir des informations exactes et à jour.</li>
          <li>La création de plusieurs comptes ou l’usurpation d’identité est interdite.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">3. Conduite de l’Utilisateur</h2>
        <ul className="terms-list">
          <li>Publiez uniquement des évaluations basées sur votre expérience réelle.</li>
          <li>Pas d’insultes, diffamation, propos discriminatoires ou contenu illégal.</li>
          <li>Ne partagez pas de données personnelles de tiers sans consentement.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">4. Contenu Interdit</h2>
        <ul className="terms-list">
          <li>Contenu diffamatoire, haineux, discriminatoire, obscène ou publicitaire.</li>
          <li>Informations confidentielles ou identifiantes non autorisées.</li>
        </ul>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">5. Propriété Intellectuelle</h2>
        <p className="terms-text">
          Vous conservez les droits sur vos contenus, mais vous accordez à la plateforme une licence
          non exclusive pour les héberger, afficher et modérer conformément aux présentes.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">6. Responsabilité</h2>
        <p className="terms-text">
          Vous êtes seul responsable des contenus publiés. La plateforme n’assume aucune responsabilité
          pour les dommages résultant de contenus d’utilisateurs.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">7. Modération</h2>
        <p className="terms-text">
          Nous pouvons supprimer, modifier ou refuser tout contenu qui contrevient aux présentes,
          et suspendre ou résilier des comptes en cas de violations répétées.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">8. Modifications</h2>
        <p className="terms-text">
          Nous pouvons mettre à jour ces conditions. Votre utilisation continue après notification vaut
          acceptation des nouvelles conditions.
        </p>
      </section>

      <section className="terms-section">
        <h2 className="terms-section-title">9. Loi Applicable et Réclamations</h2>
        <p className="terms-text">
          En cas de violation, nous nous réservons le droit d’entreprendre toutes actions légales nécessaires.
          La juridiction compétente sera précisée selon votre politique légale interne.
        </p>
      </section>
    </div>
  );
};

export default TermsFr;
