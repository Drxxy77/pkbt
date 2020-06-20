"use strict";

module.exports = {
    //Leveling System - (Event - Message)
    LEVELUP_TITLE: `Félicitations {user} !`,
    LEVELUP_DESC: `Ton **{Pokemon}** (#{ID}) vient de passer niveau \`{level}\` ! <a:animatedUmbreon:718281045119860819>`,
    //Error Register - (Event - Message)
    MESSAGE_NO_REGISTER: `Vous n'avez pas de compte, faîtes \`{prefix}start\` pour vous commencez à jouer !`,
    //Spawning (Event - Message)
    SPAWNING_TITLE: `Attrape ce fabuleux pokémon !`,
    //Prefix request (@Pikacord)
    PREFIX_REQUEST: `Mon préfix est`,
    //Command - Catch
    CATCH_NO_SPAWN: `Aucun pokémon dans ces hautes herbes !\n_Tu vas devoir attendre un peu !_`,
    CATCH_NOT_ADD: `Ce pokémon n'a pas été ajouté !`,
    CATCH_INCORRECT: `Pokémon incorrect !`,
    CATCH_CAPTURE: `tu viens d'attraper un`,
    CATCH_HELP_TITLE: `Aide - Catch`,
    CATCH_HELP_USAGES: `Utilisations :`,
    CATCH_HELP: `Attrape un pokémon apparu dans le salon !`,
    //Command - Info
    INFO_NO_POKEMON: `Vous n'avez aucun pokémon !`,
    INFO_STAT: `Statistiques`,
    INFO_LEVEl: `Niveau`,
    INFO_ATTACK: `Attaque`,
    INFO_ATTACK_SPE: `Attaque Spéciale`,
    INFO_DEFENSE: `Défense`,
    INFO_DEFENSE_SPE: `Défense Spéciale`,
    INFO_SPEED: `Vitesse`,
    INFO_NAME: `Noms`,
    INFO_HELP_TITLE: `Aide - Info`,
    INFO_HELP_USAGES: `Utilisations :`,
    INFO_HELP: `Voir son pokémon sélectionné !`,
    INFO_HELP_LATEST: `Voir son dernier pokémon !`,
    INFO_HELP_NUMBER: `Voir un pokémon en question !`,
    //Command - Help
    HELP_TITLE: `Menu d'aide`,
    HELP_DESC: `Vous pouvez voir plus de détail en faisant : \`{prefix}<commande> help\` !\nPréfix : \`{prefix}\``,
    HELP_LINK: `Liens`,
    HELP_COMMANDS: `Commandes`,
    HELP_MANAGE: `Gestion`,
    //Command - Select
    SELECT_NO_ARG: `Veuillez mettre le numéro du pokémon !`,
    SELECT_NOT_INT: `Ce n'est pas un numéro valide !`,
    SELECT_NO_POKEMON: `Vous n'avez pas de pokémon !`,
    SELECT_NOT_MUCH: `Vous n'avez pas de pokémon avec ce numéro !`,
    SELECT_END: `Tu as un nouveau compagnon !`,
    SELECT_HELP_TITLE: `Aide - Select`,
    SELECT_HELP: `Choisir un compagnon`,
    //Command - Pokémons
    POKEMONS_NOT_INT: `Vous n'avez pas mis un nombre !`,
    POKEMONS_NOT_MUCH: `Vous n'avez pas assez de pokémon pour aller sur cette page !`,
    POKEMONS_HELP_TITLE: `Aide - Pokemons`,
    POKEMONS_HELP: `Voir ses 20 premiers pokémons`,
    POKEMONS_HELP_SPECIFIC: `Voir les pokémons d'une page`,
    //Command - BotInfo
    BOTINFO_SERVERS: `serveurs`,
    BOTINFO_USERS: `utilisateurs`,
    BOTINFO_DETAILS: `Détails`,
    BOTINFO_ACCOUNT: `comptes enregistrés`,
    BOTINFO_USERS_CONNNECTED: `connectés`,
    BOTINFO_HELP_TITLE: `Aide - Botinfo`,
    BOTINFO_HELP_USAGES: `Utilisations :`,
    BOTINFO_HELP: `Informations concernant Pikacord`,
    //Command - Pokedex
    POKEDEX_FIRST_CATCH: `Capturé le {moment} pour la première fois`,
    POKEDEX_CATCH_NUMBER: `Capturé {number} fois`,
    POKEDEX_NOT_CATCH: `Pas encore capturé`,
    POKEDEX_HELP_TITLE: `Aide - Pokedex`,
    POKEDEX_HELP: `Voir les détails du 1er pokémon`,
    POKEDEX_HELP_SPECIFIC: `Voir les détails d'un pokémon spécifique`,
    //Command - Start
    START_PICKED: `Vous avez décidé de commencer l'aventure avec **{Pokemon}** !`,
    START_NOT_STARTER: `Ce n'est pas un pokémon de départ !`,
    START_PICK_DESC: `Désormais, écrivez le nom anglais d'un pokémon pour le choisir !`,
    START_PICK_TITLE: `Commencez l'aventure !`,
    START_ALREADY: `Vous êtes déjà un dresseur aguerri !`,
    START_PICH_FOOTER: `Écrivez seulement le nom du pokémon !`,
    START_HELP_TITLE: `Aide - Start`,
    START_HELP: `Commencer l'aventure !`,
    //Command - Redirect
    REDIRECT_NO_PERM: `Vous n'avez pas la permission de changer le salon de redirection !`,
    REDIRECT_NO_TARGET: `Veuillez spécifier un salon !`,
    REDIRECT_SUCCESS_EDIT: `Le salon de redirection est {NewChannel} (Anciennement : {OldChannel}) !`,
    REDIRECT_SUCCESS_NEW: `Le salon de redirection est {NewChannel} !`,
    REDIRECT_HELP_TITLE: `Aide - Redirect`,
    REDIRECT_HELP: `Select a spawning channel`,
    //Command - Leaderboard
    TOP_HELP_TITLE: `Aide - Leaderboard`,
    TOP_HELP_USAGES: `Utilisations :`,
    TOP_HELP_CATCH: `Classement de tous les pokémons attrapés`,
    TOP_HELP_RARITY: `rareté`,
    TOP_HELP_RARITY_2: `Classement fonction de la rareté`,
    TOP_EMBED_DESC: `Classement en temps réel basé sur le nombre de`,
    TOP_EMBED_CATCH: `attrapés`,
    //Command - Credits
    CREDITS_HELP_TITLE: `Aide - Crédit`,
    CREDITS_HELP: `Voir grâce à qui nous pouvons vous proposer Pikacord`,
    CREDIT_TITLE: `Crédit de Pikacord`,
    //Command - Profile
    PROFILE_HELP_TITLE: `Aide - Profil`,
    PROFILE_HELP: `Voir son profil`,
    PROFILE_HELP_SPECIFIC: `Voir un profil d'un autre joueur`,
    PROFILE_NO_ACCOUNT: `Cet utilisateur n'a aucun compte !`,
    PROFILE_PARTNER: `Compagnon`,
}