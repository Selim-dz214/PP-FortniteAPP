require('dotenv').config();

const {
  Client,
  GatewayIntentBits,
  EmbedBuilder
} = require('discord.js');

const client = new Client({
  intents: [GatewayIntentBits.Guilds]
});

const activeKeys = new Map();

client.once('ready', () => {
  console.log(`Bot connecté : ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'create-party') return;

  const jeu = interaction.options.getString('jeu');
  const construction = interaction.options.getString('construction');
  const equipe = interaction.options.getString('equipe');
  const classement = interaction.options.getString('classement');
  const cle = interaction.options.getString('cle');
  const duree = interaction.options.getString('duree');

  const durees = {
    '30m': 30 * 60 * 1000,
    '1h': 60 * 60 * 1000,
    '2h': 2 * 60 * 60 * 1000,
    '3h': 3 * 60 * 60 * 1000,
    '5h': 5 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000
  };

  const embed = new EmbedBuilder()
    .setColor(0x5865F2)
    .setTitle('🎮 Nouvelle partie Fortnite')
    .addFields(
      { name: 'Jeu', value: jeu, inline: true },
      { name: 'Construction', value: construction, inline: true },
      { name: 'Équipe', value: equipe, inline: true },
      { name: 'Classement', value: classement, inline: true },
      { name: 'Organisateur', value: interaction.user.tag }
    )
    .setTimestamp();

  try {
    const message = await interaction.channel.send({
      embeds: [embed]
    });

    const thread = await message.startThread({
      name: `Partie ${jeu} - ${interaction.user.username}`,
      autoArchiveDuration: 60
    });

    let confirmation = `✅ Ta partie a été créée : ${thread}`;

    if (cle) {
      if (!duree || !durees[duree]) {
        await interaction.reply({
          content: 'Choisis une durée valide pour ta clé.',
          ephemeral: true
        });
        return;
      }

      const expiration = Date.now() + durees[duree];

      activeKeys.set(thread.id, {
        key: cle,
        expiration
      });

      setTimeout(() => {
        activeKeys.delete(thread.id);
      }, durees[duree]);

      confirmation += `\n🔑 Ta clé : ||${cle}||`;
      confirmation += `\n⏱️ Conservation : ${duree}`;
    }

    await interaction.reply({
      content: confirmation,
      ephemeral: true
    });

    console.log('Partie créée :', thread.id);

  } catch (error) {
    console.error(error);

    if (!interaction.replied) {
      await interaction.reply({
        content: '❌ Impossible de créer la partie. Vérifie les permissions du bot.',
        ephemeral: true
      });
    }
  }
});

client.login(process.env.DISCORD_TOKEN);
