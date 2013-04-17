
set :application, "telegraph"
set :repository,  "git@github.com:CircuitLab/#{application}.git"

set :user, "ec2-user"
set :scm, :git
set :scm_verbose, true
set :git_shallow_clone, 1

set :deploy_to, "/home/#{user}/app/#{application}"
set :deploy_via, :remote_cache

set :use_sudo, false

set :node_port, 80
set :process_uid, ''
set :process_env, "PORT=#{node_port}"

set :default_environment, {
  "PATH" => "~/.nodebrew/current/bin:$PATH"
}

default_run_options[:pty] = true
ssh_options[:forward_agent] = true

role :web, "teba.uniba.jp"
role :app, "teba.uniba.jp"

namespace :deploy do
  task :start, :roles => :app do
    sudo "#{process_env} forever start #{current_path}/app.js"
  end
  task :stop, :roles => :app do
    sudo "forever stop #{current_path}/app.js"
  end
  task :restart, :roles => :app, :except => { :no_release => true } do
    sudo "#{process_env} forever restart #{current_path}/app.js"
  end
end

after "deploy:create_symlink", :roles => :app do
  run "ln -svf #{shared_path}/node_modules #{current_path}/node_modules"
  run "ln -svf #{shared_path}/secrets/* #{current_path}/config/secrets"
  run "cd #{current_path} && npm i"
end

after "deploy:setup", :roles => :app do
  run "mkdir -p #{shared_path}/node_modules"
  run "mkdir -p #{shared_path}/secrets"
end