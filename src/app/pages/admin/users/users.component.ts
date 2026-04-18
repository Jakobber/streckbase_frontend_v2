import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { faUser, IconDefinition } from "@fortawesome/free-solid-svg-icons";

import { UsersService } from "./users.service";
import { User } from "./../../../types/user";

@Component({
  selector: "app-admin-users",
  templateUrl: "./users.component.html",
  styleUrls: ["./users.component.scss"]
})
export class UsersComponent implements OnInit {
  private currentUser: User;
  public lobare: User[] = [];
  public andra: User[] = [];
  public archivedUsers: User[] = [];
  public showArchivedUsers: boolean = false;
  public faUser: IconDefinition = faUser;
  public isNewUser: boolean = true;
  public showUserModal: boolean = false;
  public loading: boolean = false;
  public modalTitle: string;
  public userForm = new FormGroup({
    firstname: new FormControl(""),
    lastname: new FormControl(""),
    id: new FormControl("", Validators.pattern(/\d{10}/)),
    email: new FormControl("", Validators.email),
    lobare: new FormControl(1),
    admin: new FormControl(false),
    debt: new FormControl({ value: 0, disabled: true }, Validators.pattern(/\d+/))
  });

  constructor(private usersService: UsersService) { }

  ngOnInit() {
    this.getUsers();
    this.getArchivedUsers();
  }

  private getUsers() {
    this.usersService.getUsers()
      .subscribe((users: User[]) => {
        this.lobare = users.filter((u: User) => u.lobare === 1).reverse();
        this.andra = users.filter((u: User) => u.lobare !== 1).reverse();
      });
  }

  private getArchivedUsers() {
    this.usersService.getArchivedUsers()
      .subscribe((users: User[]) => this.archivedUsers = users);
  }

  disable() {
    if (!this.currentUser || this.loading) return;
    this.loading = true;
    this.usersService.disableUser(this.currentUser.id)
      .subscribe(() => {
        this.getUsers();
        this.getArchivedUsers();
        this.showUserModal = false;
        this.loading = false;
      }, () => { this.loading = false; });
  }

  restoreUser(user: User) {
    this.usersService.restoreUser(user.id)
      .subscribe(() => {
        this.getUsers();
        this.getArchivedUsers();
      });
  }

  repay() {
    if (!this.currentUser || this.loading) return;
    const input = window.prompt("Ange återbetalningsbelopp (kr):");
    const amount = parseInt(input, 10);
    if (!amount || amount <= 0) return;
    this.loading = true;

    this.usersService.createRepayment(this.currentUser.id, amount)
      .subscribe(() => {
        this.getUsers();
        this.showUserModal = false;
        this.loading = false;
      }, () => {
        this.loading = false;
      });
  }

  toggleUserModal() {
    if (this.showUserModal) {
      this.showUserModal = false;
      this.isNewUser = false;
    } else {
      this.userForm.reset({ lobare: 1 });
      this.currentUser = null;
      this.userForm.get("debt").disable();
      this.userForm.get("firstname").enable();
      this.userForm.get("lastname").enable();
      this.userForm.get("id").enable();
      this.showUserModal = true;
      this.isNewUser = true;
    }
  }

  edit(user: User) {
    this.isNewUser = false;
    this.currentUser = user;
    this.userForm.setValue({
      firstname: user.firstname,
      lastname: user.lastname,
      id: user.id,
      email: user.email,
      lobare: user.lobare,
      admin: user.admin,
      debt: user.debt
    });

    this.userForm.get("debt").enable();
    this.userForm.get("firstname").disable();
    this.userForm.get("lastname").disable();
    this.userForm.get("id").disable();
    this.showUserModal = true;
  }

  submit() {
    if (this.userForm.valid && this.userForm.dirty && !this.loading) {
      this.loading = true;
      const user: User = {
        ...this.currentUser,
        ...this.userForm.value,
        debt: this.userForm.value.debt ? parseInt(this.userForm.value.debt, 10) : null,
        lobare: parseInt(this.userForm.value.lobare, 10)
      };

      this.usersService.updateUser(user, this.isNewUser)
        .subscribe(() => {
          this.getUsers();
          this.getArchivedUsers();
          this.userForm.reset();
          this.showUserModal = false;
          this.loading = false;
        }, () => {
          console.log("Some error occured when handling user");
          this.showUserModal = false;
          this.loading = false;
        });
    } else {
      this.showUserModal = false;
    }
  }

}
