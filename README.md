# Dotfiles


## Setup:

Run:
```bash
# enter home directory
cd

# clone bare into ~/.dotfiles folder
git clone git@github.com:arekmaz/dotfiles.git --bare .dotfiles

# checkout the actual content from the bare repository in ~
git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME checkout main .

# set the global flag excludesFile to the .gitignore.defaults file
git config --global core.excludesFile '~/.gitignore.defaults'
```

Restart the shell or run: `source ~/.bashrc` or `. ~/.bashrc`

From now on you can use the `,dot` script as a replacement for `git` command for dotfiles.
Alternatively you can use the `,lazydot` if you have [lazygit](https://github.com/jesseduffield/lazygit) installed.

All my scripts are prefixed with `,` for an easier separation from other programs.

## Bun monolith utils

One particular command is the `,m` [https://bun.sh](Bun) command tree monolith (inspired by [https://github.com/rwxrob](rwxrob)).
To set it up, install Bun and then: `cd ~/scripts/bun && bun install`, that's it.
Now you can run stuff like `,m weather -lc`.

