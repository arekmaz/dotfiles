# If you come from bash you might have to change your $PATH.
# export PATH=$HOME/bin:/usr/local/bin:$PATH

export ANDROID_HOME="$HOME/Library/Android/sdk"

export LESSOPEN="| /usr/local/bin/src-hilite-lesspipe.sh %s"

# dotfiles management - run instead of git for dotfiles
alias dotfiles='/usr/bin/git --git-dir=$HOME/.dotfiles/ --work-tree=$HOME'


export DENO_INSTALL="$HOME/.deno"
export PATH="/opt/homebrew/bin:$PATH"
export PATH="$DENO_INSTALL/bin:$PATH"

export SB_HOME="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/me"

alias sb='cd "$SB_HOME"'

export PATH="$PATH:$ANDROID_HOME/platform-tools:$ANDROID_HOME/tools"
export PATH="$PATH:/opt/diff-so-fancy"
export PATH="$PATH:/opt/metasploit-framework/bin"

export PATH="$PATH:$HOME/scripts"
export PATH="$PATH:/opt/aircrack-ng"

export JAVA_HOME=/opt/homebrew/opt/openjdk@11
# export JAVA_HOME=$(/usr/libexec/java_home)
# javahome() {
#   unset JAVA_HOME
#   export JAVA_HOME=$(/usr/libexec/java_home -v "$1");
#   java -version
# }
# alias java11='javahome 11'
# alias java18='javahome 18'

# Path to your oh-my-zsh installation.
export ZSH="/Users/arek/.oh-my-zsh"

# Set name of the theme to load --- if set to "random", it will
# load a random theme each time oh-my-zsh is loaded, in which case,
# to know which specific one was loaded, run: echo $RANDOM_THEME
# See https://github.com/robbyrussell/oh-my-zsh/wiki/Themes
# ZSH_THEME="robbyrussell"
ZSH_THEME="eastwood"

# Set list of themes to pick from when loading at random
# Setting this variable when ZSH_THEME=random will cause zsh to load
# a theme from this variable instead of looking in ~/.oh-my-zsh/themes/
# If set to an empty array, this variable will have no effect.
# ZSH_THEME_RANDOM_CANDIDATES=( "robbyrussell" "agnoster" )

# Uncomment the following line to use case-sensitive completion.
# CASE_SENSITIVE="true"

# Uncomment the following line to use hyphen-insensitive completion.
# Case-sensitive completion must be off. _ and - will be interchangeable.
# HYPHEN_INSENSITIVE="true"

# Uncomment the following line to disable bi-weekly auto-update checks.
# DISABLE_AUTO_UPDATE="true"

# Uncomment the following line to change how often to auto-update (in days).
# export UPDATE_ZSH_DAYS=13

# Uncomment the following line to disable colors in ls.
# DISABLE_LS_COLORS="true"

# Uncomment the following line to disable auto-setting terminal title.
# DISABLE_AUTO_TITLE="true"

# Uncomment the following line to enable command auto-correction.
# ENABLE_CORRECTION="true"

# Uncomment the following line to display red dots whilst waiting for completion.
# COMPLETION_WAITING_DOTS="true"

# Uncomment the following line if you want to disable marking untracked files
# under VCS as dirty. This makes repository status check for large repositories
# much, much faster.
# DISABLE_UNTRACKED_FILES_DIRTY="true"

# Uncomment the following line if you want to change the command execution time
# stamp shown in the history command output.
# You can set one of the optional three formats:
# "mm/dd/yyyy"|"dd.mm.yyyy"|"yyyy-mm-dd"
# or set a custom format using the strftime function format specifications,
# see 'man strftime' for details.
# HIST_STAMPS="mm/dd/yyyy"

# Would you like to use another custom folder than $ZSH/custom?
# ZSH_CUSTOM=/path/to/new-custom-folder
#
export NVM_LAZY_LOAD=true
export NVM_COMPLETION=true

export ZSH_HIGHLIGHT_HIGHLIGHTERS_DIR=/opt/homebrew/share/zsh-syntax-highlighting/highlighters
# Which plugins would you like to load?
# Standard plugins can be found in ~/.oh-my-zsh/plugins/*
# Custom plugins may be added to ~/.oh-my-zsh/custom/plugins/
# Example format: plugins=(rails git textmate ruby lighthouse)
# Add wisely, as too many plugins slow down shell startup.
plugins=(
  # zsh-nvm
  git
  aliases
  ag
  zsh-syntax-highlighting
  bgnotify
  tmux
  yarn
  node
  history
  docker
  docker-compose
  dotnet
  kubectl
)

source $ZSH/oh-my-zsh.sh

# User configuration

# export MANPATH="/usr/local/man:$MANPATH"

# You may need to manually set your language environment
# export LANG=en_US.UTF-8

# Preferred editor for local and remote sessions
if [[ -n $SSH_CONNECTION ]]; then
  export EDITOR='nvim'
else
  export EDITOR='nvim'
fi

# Compilation flags
# export ARCHFLAGS="-arch x86_64"

# ssh
# export SSH_KEY_PATH="~/.ssh/rsa_id"

# Set personal aliases, overriding those provided by oh-my-zsh libs,
# plugins, and themes. Aliases can be placed here, though oh-my-zsh
# users are encouraged to define aliases within the ZSH_CUSTOM folder.
# For a full list of active aliases, run `alias`.
#
# Example aliases
# alias zshconfig="mate ~/.zshrc"
# alias ohmyzsh="mate ~/.oh-my-zsh"
#
alias lg=lazygit
alias fly_push='gwip && npm version patch && gp && fly deploy'

# react-native
alias react-native='npx react-native'
alias rn='react-native'

# git
alias gpv='git push --no-verify'
alias gcamv='git push --no-verify -m'

# tmux:
alias t='tmux'
alias ts='tmux new-session -s'
alias ta='tmux attach -t'
alias td='tmux detach'
alias tk='tmux kill-session -t'
alias tl='tmux ls'

# nodemon:
alias ndm='nodemon'

# npm
alias nau='(rm -rf node_modules package-lock.json yarn.lock || true) && npm i'

alias p=pnpm

# yarn:
alias y='yarn'
alias yt='yarn test'
alias ytw='yarn test:watch'
alias ytd='yarn test:debug'
alias ys='yarn start'
alias yl='yarn lint'
alias yd='yarn dev'
alias ycl='yarn clean'

alias yl='yarn list'

alias ya='yarn add'
alias yad='yarn add -D'
alias yr='yarn remove'

alias yios='yarn ios'
alias yand='yarn android'

alias yga='yarn global add'
alias ygu='yarn global upgrade'
alias ygr='yarn global remove'
alias ygl='yarn global list'

alias ytnc='yarn test --no-cache'
alias ytcw='yarn test:coverage --watch'
alias ytc='yarn test:coverage'
alias yta='yarn test:all'
alias yte='yarn cypress'
alias yteh='yarn cypress:headless'
alias ytu='yarn test:update'
alias yau='(rm -rf node_modules yarn.lock package-lock.json || true) && yarn'
alias ypr='yarn playwright'

# chalet:
alias ch='chalet'
alias chl='chalet ls'
alias cha='chalet add'
alias chr='chalet rm --name'

# expo:
alias e='expo'
alias ei='expo install'

# fasd
[ -f ~/.fzf.zsh ] && source ~/.fzf.zsh
eval "$(fasd --init auto)"

alias f="fasd -fl"
alias fli="fasd -fli"
alias d="fasd -dl"
alias di="fasd -dli"
alias a="fasd -asi"

#alias v="fasd -1 -e nvim -f"
#alias vi="fasd -e nvim -fi"
alias v="nvim"
alias fv="fasd -flie nvim"
alias dv="fasd -dlie nvim"
alias av="fasd -alie nvim"
alias o="fasd -1 -e open -a"
alias oi="fasd -e open -ai"
alias rgr="fasd -1 -e ranger -a"

alias codef="fasd -1 -e code -f"
alias coded="fasd -1 -e code -d"
alias codea="fasd -1 -e code -a"
alias codes="fasd -e code -ai"

alias vsc="fasd -1 -e code -a"

function vt {
  vsc "$@"
  exit
}

# utils
alias clc='clipcopy'
alias clp='clippaste'

alias vim='nvim'
alias vi='nvim'
alias v='fasd -1 -e nvim -f'

alias c='clear'
alias cls='clear'


# make and enter
function makeAndEnter() {
	mkdir -p $1 && cd $1;
}
alias cde='makeAndEnter'

alias tmp=" cd /tmp"

export NODE_PATH="$HOME/.config/yarn/global/node_modules"

export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"
autoload -U +X bashcompinit && bashcompinit
complete -o nospace -C /usr/local/bin/bit bit

# export NVM_DIR="$HOME/.nvm"
# [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
# [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

# pnpm
export PNPM_HOME="$HOME/Library/pnpm"
export PATH="$PNPM_HOME:$PATH"
# pnpm end

# nvm use default > /dev/null

# measure zsh startup time
timezsh() {
  shell=${1-$SHELL}
  for i in $(seq 1 10); do /usr/bin/time $shell -i -c exit; done
}

# zmodload zsh/zprof
