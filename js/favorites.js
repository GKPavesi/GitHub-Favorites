import { GitHubUser } from "./githubuser.js";

class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = JSON.parse(localStorage.getItem("@github-favorites:")) || [];
    }

    save() {
        localStorage.setItem('@github-favorites:', JSON.stringify(this.entries));
    }

    async add(username) {
        try {

            const userExists = this.entries.find(entry => entry.login.toLowerCase() == username.toLowerCase())

            if (userExists) {
                throw new Error("Usuário já cadastrado")
            }

            const user = await GitHubUser.search(username)
            
            if (user.login == undefined) {
                throw new Error("Usuário não encontrado")
            }
            this.entries = [user, ...this.entries];
            this.update();
            this.save();
        } catch (error) {
            alert(error.message)
        }
    }

    delete(user) {
        this.entries = this.entries.filter(entry => entry.login !== user.login);
        this.update();
        this.save();
    }
}

class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update();
        this.onAdd();
    }

    onAdd() {
        const addButton = this.root.querySelector(".search button")
        addButton.onclick = () => {
            const { value } = this.root.querySelector(".search input")
            addButton.disabled = true;
            this.add(value).then(() => {
                addButton.disabled = false;
            })
        }
    }

    update() {
        this.removeAllTr();

        this.entries.forEach(user => {
            const row = this.createRow(user.login, user.name, user.public_repos, user.followers);
            row.querySelector('.remove').onclick = () => {
                const isOkToDelete = confirm("Tem certeza que deseja deletar essa linha?");
                if (isOkToDelete) {
                    this.delete(user);
                }
            }
            this.tbody.append(row)
        })

    }

    createRow(login, name, public_repos, followers) {

        const tr = document.createElement('tr')

        tr.innerHTML = `
        <td class="user">
            <img src="https://github.com/${login}.png" alt="Imagem de ${login}">
            <a href="https://github.com/${login}" target="_blank">
                <p>${name}</p>
                <span>${login}</span>
            </a>
        </td>
        <td class="repositories">
            ${public_repos}
        </td>
        <td class="followers">
            ${followers}
        </td>
        <td>
            <button class="remove">&times;</button>
        </td>
        `

        return tr;
    }

    removeAllTr() {

        this.tbody.querySelectorAll('tr').forEach((tr) => {
            tr.remove();
        });
    }

}

export { FavoritesView }