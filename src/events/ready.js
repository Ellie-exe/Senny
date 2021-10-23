module.exports = {
    name: 'ready',
    async execute() {
        try {
            client.application.commands.fetch()
                .then(async currentCommands => {
                    client.commands.each(async command => {
                        const currentCommand = currentCommands.find(c => c.name === command.data.name);
                        const keys = Object.keys(command.data);

                        if (!currentCommand) {
                            await client.application.commands.create(command.data.toJSON());

                        } else {
                            /** @returns boolean */
                            function arrayMatch(options, currentOptions) {
                                for (const option of options) {
                                    const currentOption = currentOptions.find(o => o.name === option.name);
                                    const optionKeys = Object.keys(option);

                                    for (const key of optionKeys) {
                                        const value = option[key];
                                        const currentValue = currentOption[key];

                                        if (Array.isArray(value)) {
                                            if (!arrayMatch(value, currentValue)) return false;

                                        } else {
                                            if (key === 'required' && !value && !currentValue) continue;
                                            if (value !== currentValue) return false;
                                        }
                                    }
                                }

                                return true;
                            }

                            for (const key of keys) {
                                const value = command.data[key];
                                const currentValue = currentCommand[key];

                                if (Array.isArray(value)) {
                                    if (arrayMatch(value, currentValue)) continue;

                                } else if (value === currentValue) continue;

                                return await currentCommand.edit(command.data.toJSON());
                            }
                        }
                    });

                    currentCommands.each(async currentCommand => {
                        if (!client.commands[currentCommand.name]) {
                            await currentCommand.delete();
                        }
                    });
                });

        } catch (err) {
            logger.error(err);
        }
    }
};
