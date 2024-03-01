# Dotfiles


setup:

```bash
# enter home directory
cd

# clone bare into ~/.dotfiles folder
gcl git@github.com:arekmaz/dotfiles.git --bare .dotfiles --depth 1

# one time "dotfiles" alias def
alias dotfiles='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'

# checkout the actual content from the bare repository in ~
dotfiles checkout main .

# set the global flag showUntrackedFiles to the .gitignore.defaults file
git config --global core.excludesFile '~/.gitignore.defaults'



