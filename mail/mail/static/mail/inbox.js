document.addEventListener('DOMContentLoaded', function () {
  history.replaceState({}, document.title, "/");

  document.querySelector('#inbox').addEventListener('click', () => {
    setActiveTab('inbox');
    load_mailbox('inbox');
  });

  document.querySelector('#sent').addEventListener('click', () => {
    setActiveTab('sent');
    load_mailbox('sent');
  });

  document.querySelector('#archived').addEventListener('click', () => {
    setActiveTab('archived');
    load_mailbox('archive');
  });

  document.querySelector('#compose').addEventListener('click', () => {
    setActiveTab('compose');
    compose_email();
  });

  document.querySelector('#compose-form').onsubmit = send_email;

  // Default view
  setActiveTab('inbox');
  load_mailbox('inbox');
});

// Подсветка активной вкладки
function setActiveTab(tabId) {
  const allTabs = ['inbox', 'sent', 'archived', 'compose'];
  allTabs.forEach(id => {
    const el = document.querySelector(`#${id}`);
    if (el) el.classList.remove('active-tab');
  });
  const current = document.querySelector(`#${tabId}`);
  if (current) current.classList.add('active-tab');
}

function compose_email() {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'block';

  document.querySelector('#compose-recipients').value = '';
  document.querySelector('#compose-subject').value = '';
  document.querySelector('#compose-body').value = '';
}

function send_email(event) {
  event.preventDefault();

  fetch('/emails', {
    method: 'POST',
    body: JSON.stringify({
      recipients: document.querySelector('#compose-recipients').value,
      subject: document.querySelector('#compose-subject').value,
      body: document.querySelector('#compose-body').value
    })
  })
  .then(response => response.json())
  .then(result => {
    console.log(result);
    setActiveTab('sent');
    load_mailbox('sent');
  });
}

function load_mailbox(mailbox) {
  setActiveTab(mailbox);

  document.querySelector('#emails-view').style.display = 'block';
  document.querySelector('#email-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';

  document.querySelector('#emails-view').innerHTML = `<h3 class="mail-header">${mailbox.charAt(0).toUpperCase() + mailbox.slice(1)}</h3>`;

  fetch(`/emails/${mailbox}`)
    .then(response => response.json())
    .then(emails => {
      emails.forEach(email => {
        const div = document.createElement('div');
        div.className = 'email-item';
        if (email.read) div.classList.add('read');

        div.innerHTML = `
          <strong>${mailbox === 'sent' ? 'To' : 'From'}:</strong> ${mailbox === 'sent' ? email.recipients.join(', ') : email.sender}
          <br><strong>Subject:</strong> ${email.subject}
          <br><span>${email.timestamp}</span>
        `;

        div.addEventListener('click', () => view_email(email.id));
        document.querySelector('#emails-view').append(div);
      });
    });
}

function view_email(id) {
  document.querySelector('#emails-view').style.display = 'none';
  document.querySelector('#compose-view').style.display = 'none';
  document.querySelector('#email-view').style.display = 'block';

  fetch(`/emails/${id}`)
    .then(response => response.json())
    .then(email => {
      fetch(`/emails/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ read: true })
      });

      document.querySelector('#email-view').innerHTML = `
        <ul style="list-style: none; padding: 0;">
          <li><strong>From:</strong> ${email.sender}</li>
          <li><strong>To:</strong> ${email.recipients.join(', ')}</li>
          <li><strong>Subject:</strong> ${email.subject}</li>
          <li><strong>Timestamp:</strong> ${email.timestamp}</li>
        </ul>
        <div class="action-buttons">
          <button class="btn-sm" id="reply">Reply</button>
          ${email.sender !== document.querySelector('h2, .mail-header').textContent && email.archived !== undefined ? 
            `<button class="btn-sm" id="archive">${email.archived ? 'Unarchive' : 'Archive'}</button>` : ''}
        </div>
        <hr>
        <p>${email.body.replace(/\n/g, '<br>')}</p>
      `;

      if (email.sender !== document.querySelector('h2, .mail-header').textContent) {
        document.querySelector('#archive').addEventListener('click', () => {
          fetch(`/emails/${id}`, {
            method: 'PUT',
            body: JSON.stringify({ archived: !email.archived })
          }).then(() => load_mailbox('inbox'));
        });
      }

      document.querySelector('#reply').addEventListener('click', () => {
        compose_email();
        document.querySelector('#compose-recipients').value = email.sender;
        document.querySelector('#compose-subject').value = email.subject.startsWith("Re:") ? email.subject : "Re: " + email.subject;
        document.querySelector('#compose-body').value = `On ${email.timestamp}, ${email.sender} wrote:\n${email.body}\n\n`;
      });
    });
}
