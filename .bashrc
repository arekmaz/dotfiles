export BASH_SILENCE_DEPRECATION_WARNING=1

# sync history between all tmux sessions

# append unique commands to global history immediately
shopt -s histappend
export HISTCONTROL=ignoreboth:erasedups
# export PROMPT_COMMAND="history -a; $PROMPT_COMMAND"
export PROMPT_COMMAND="history -a; history -c; history -r; $PROMPT_COMMAND"

# set -o vi
# bind 'set completion-ignore-case on'
# bind 'TAB:menu-complete'
# bind '"\e[Z":menu-complete-backward'
# bind 'set show-all-if-ambiguous on'

export PATH=/opt/homebrew/bin:/usr/local/bin:/System/Cryptexes/App/usr/bin:/usr/bin:/bin:/usr/sbin:/sbin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/local/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/bin:/var/run/com.apple.security.cryptexd/codex.system/bootstrap/usr/appleinternal/bin
# Enable the subsequent settings only in interactive sessions
case $- in
  *i*) ;;
    *) return;;
esac

export EDITOR='vi'

# alias ls='ls --color=auto'

export PATH="$PATH:$HOME/scripts"
export PATH="$PATH:/Library/TeX/texbin"

export SB_HOME="$HOME/Library/Mobile Documents/iCloud~md~obsidian/Documents/me"
alias sb='cd "$SB_HOME"'

[ -f ~/.fzf.bash ] && source ~/.fzf.bash

export NVM_DIR="$HOME/.nvm"
source "${NVM_DIR}/nvm.sh"

parse_git_branch() {
     git branch 2> /dev/null | sed -e '/^[^*]/d' -e 's/* \(.*\)/[\1]/'
}

function show_user_host_if_remote() {
  local home_host="mac.local" # Change this to your home or host machine's hostname
  local current_host=$(hostname)

  if [[ "$current_host" != "$home_host" ]]; then
    local user=$(whoami)
    local host=$(hostname -s) # -f for fully qualified domain name, if necessary
    echo "${user}@${host}:"
  fi
}

# export PS1="\[\e[91m\]\$(parse_git_branch)\$(show_user_host_if_remote)\[\e[32m\][\w]\[\e[00m\]$ "
# export PS1="\$(show_user_host_if_remote)\w$ "
export PS1="\$(whoami)@$(hostname -s):\w$ "


# pnpm
export PNPM_HOME="$HOME/Library/pnpm"
case ":$PATH:" in
  *":$PNPM_HOME:"*) ;;
  *) export PATH="$PNPM_HOME:$PATH" ;;
esac
# pnpm end

export FZF_CTRL_T_COMMAND='fd . --absolute-path --hidden --max-results=1000000 | sed "s|^$HOME|~|"'

__fzf_select__() {
  local cmd opts
  cmd="${FZF_CTRL_T_COMMAND:-"command find -L . -mindepth 1 \\( -path '*/.*' -o -fstype 'sysfs' -o -fstype 'devfs' -o -fstype 'devtmpfs' -o -fstype 'proc' \\) -prune \
    -o -type f -print \
    -o -type d -print \
    -o -type l -print 2> /dev/null | command cut -b3-"}"
  opts="--height ${FZF_TMUX_HEIGHT:-40%} --bind=ctrl-z:ignore --reverse --scheme=path ${FZF_DEFAULT_OPTS-} ${FZF_CTRL_T_OPTS-} -m"
  eval "$cmd" |
    FZF_DEFAULT_OPTS="$opts" $(__fzfcmd) "$@" |
    while read -r item; do
      if [[ "$item" == ~* ]]
      then
        printf "~%q " "${item:1}" # if starts with ~, dont escape it at the start
      else
        printf '%q ' "$item"  # escape special chars
      fi
    done
}

alias fly_push='gwip && npm version patch && git push && fly deploy'

# bun
export BUN_INSTALL="$HOME/.bun"
export PATH=$BUN_INSTALL/bin:$PATH

if [[ "$TERM" == "alacritty" ]]; then
  alias tmux='TERM=alacritty-direct $(which tmux)'
  alias ssh='TERM=xterm-256color ssh'
fi
