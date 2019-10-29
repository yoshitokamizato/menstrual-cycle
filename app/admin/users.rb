ActiveAdmin.register User do
  permit_params :name, :email, :password, :password_confirmation, :flag

  form do |f|
    f.inputs do
      f.input :name
      f.input :email
      f.input :password
      f.input :password_confirmation
      f.input :flag
    end
    f.actions
  end
end
