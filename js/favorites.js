class Favorites {
    constructor(root) {
        this.root = document.querySelector(root);
        this.load();
    }

    load() {
        this.entries = [
            {
                login: "maykbrito",
                name: "Mayk Brito",
                public_repos: '76',
                followers: '9589'
            },
            {
                login: "diego3g",
                name: "Diego Fernandes",
                public_repos: '48',
                followers: '22503'
            }
        ]
    }

    delete(user) {
        const filteredEntries = this.entries.filter(entry => entry.login !== user.login);

        this.entries = filteredEntries;
    }
}

class FavoritesView extends Favorites {
    constructor(root) {
        super(root)

        this.tbody = this.root.querySelector("table tbody")

        this.update();
    }

    update() {
        this.removeAllTr();

        this.entries.forEach(user => {
            const row = this.createRow(user.login, user.name, user.public_repos, user.followers);
            row.querySelector('.remove').onclick = () => {
                const isOkToDelete = confirm("Tem certeza que deseja deletar essa linha?");
                if (isOkToDelete) {
                    this.delete(user);
                    this.update();
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

export { Favorites, FavoritesView }