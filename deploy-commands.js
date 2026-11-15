require('dotenv').config();
const { REST, Routes, SlashCommandBuilder } = require('discord.js');

const commands = [
  new SlashCommandBuilder()
    .setName('create-party')
    .setDescription('Créer une partie Fortnite')
    .addStringOption(option =>
      option.setName('jeu')
        .setDescription('Type de jeu')
        .setRequired(true)
        .addChoices(
          { name: 'Battle Royale', value: 'Battle Royale' },
          { name: 'Reload', value: 'Reload' },
          { name: 'OG', value: 'OG' }
        ))
    .addStringOption(option =>
      option.setName('construction')
        .setDescription('Mode de construction')
        .setRequired(true)
        .addChoices(
          { name: 'Build', value: 'Build' },
          { name: 'Zero Build', value: 'Zero Build' }
        ))
    .addStringOption(option =>
      option.setName('equipe')
        .setDescription('Taille de l’équipe')
        .setRequired(true)
        .addChoices(
          { name: 'Duo', value: 'Duo' },
          { name: 'Trio', value: 'Trio' },
          { name: 'Section', value: 'Section' }
        ))
    .addStringOption(option =>
      option.setName('classement')
        .setDescription('Type de partie')
        .setRequired(true)
        .addChoices(
          { name: 'Classée', value: 'Classée' },
          { name: 'Non classée', value: 'Non classée' }
        ))
    .addStringOption(option =>
      option.setName('cle')
        .setDescription('Clé d’accès (facultatif)')
        .setRequired(false))
    .addStringOption(option =>
      option.setName('duree')
        .setDescription('Durée de conservation de la clé')
        .setRequired(false)
        .addChoices(
          { name: '30 minutes', value: '30m' },
          { name: '1 heure', value: '1h' },
          { name: '2 heures', value: '2h' },
          { name: '3 heures', value: '3h' },
          { name: '5 heures', value: '5h' },
          { name: '24 heures', value: '24h' }
        ))
    .toJSON()
];

const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);

(async () => {
  try {
    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );
    console.log('Commande /create-party enregistrée !');
  } catch (error) {
    console.error(error);
  }
})();
