import { Command } from "../structures/Command";
import { client } from "..";

export default new Command({
    name: "help",
    description: "查看本bot的训练指南",
    run: async ({ interaction }) => {
        await interaction.deferReply({ ephemeral: true });
        await interaction.editReply({ 
            content: "训练指南撰写中..."
        });
    }
});