app.post('/resetpassword', async (req, res) => {
  const { email, lastname } = req.body;

  // Recherche de l'utilisateur dans la base de données
  const user = await User.findOne({ email, lastname });
  
  if (!user) {
    // Si l'utilisateur n'est pas trouvé, renvoyer un message d'erreur
    return res.status(400).send('Utilisateur non trouvé.');
  }

  // Si l'utilisateur est trouvé, envoyer un email avec un lien pour réinitialiser le mot de passe
  // Vous pouvez utiliser la bibliothèque nodemailer ou une autre bibliothèque pour envoyer des emails
  // Assurez-vous d'avoir configuré les paramètres d'envoi d'email
  // Le lien de réinitialisation du mot de passe peut être quelque chose comme `https://yourwebsite.com/resetpassword/${user._id}`
  // Vous pouvez utiliser un token JWT ou un autre mécanisme pour sécuriser le lien de réinitialisation du mot de passe

  // sendResetPasswordEmail(user.email, resetPasswordLink);

  res.send('Un email a été envoyé avec un lien pour réinitialiser votre mot de passe.');
});