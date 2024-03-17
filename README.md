# Dotfiles


setup:

```bash
# enter home directory
cd

# clone bare into ~/.dotfiles folder
git clone git@github.com:arekmaz/dotfiles.git --bare .dotfiles

# checkout the actual content from the bare repository in ~
git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME checkout main .

# set the global flag excludesFile to the .gitignore.defaults file
git config --global core.excludesFile '~/.gitignore.defaults'



