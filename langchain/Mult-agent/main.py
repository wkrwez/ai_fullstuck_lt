from langchain_community.chat_models.tongyi import ChatTongyi
from langchain.tools import tool
from langchain.agents import create_agent
model = ChatTongyi(
        model="qwen-plus",
        streaming=True,
    )
@tool
def create_calendar_event(
    title: str,
    start_time: str,       # ISO format: "2024-01-15T14:00:00"
    end_time: str,         # ISO format: "2024-01-15T15:00:00"
    attendees: list[str],  # email addresses
    location: str = ""
) -> str:
    """Create a calendar event. Requires exact ISO datetime format."""
    # Stub: In practice, this would call Google Calendar API, Outlook API, etc.
    return f"Event created: {title} from {start_time} to {end_time} with {len(attendees)} attendees"


@tool
def send_email(
    to: list[str],  # email addresses
    subject: str,
    body: str,
    cc: list[str] = []
) -> str:
    """Send an email via email API. Requires properly formatted addresses."""
    # Stub: In practice, this would call SendGrid, Gmail API, etc.
    return f"Email sent to {', '.join(to)} - Subject: {subject}"


@tool
def get_available_time_slots(
    attendees: list[str],
    date: str,  # ISO format: "2024-01-15"
    duration_minutes: int
) -> list[str]:
    """Check calendar availability for given attendees on a specific date."""
    # Stub: In practice, this would query calendar APIs
    return ["09:00", "14:00", "16:00"]

# CALENDAR_AGENT_PROMPT = (
#     "You are a calendar scheduling assistant. "
#     "Parse natural language scheduling requests (e.g., 'next Tuesday at 2pm') "
#     "into proper ISO datetime formats. "
#     "Use get_available_time_slots to check availability when needed. "
#     "If there is no suitable time slot, stop and confirm unavailability in your response. "
#     "Use create_calendar_event to schedule events. "
#     "Always confirm what was scheduled in your final response."
# )
#------------------------------------------------创建日历
# calendar_agent = create_agent(
#     model,
#     tools=[create_calendar_event, get_available_time_slots],
#     system_prompt=CALENDAR_AGENT_PROMPT,
# )


# query = "Schedule a team meeting next Tuesday at 2pm for 1 hour"

# for step in calendar_agent.stream(
#     {"messages": [{"role": "user", "content": query}]}
# ):
#     for update in step.values():
#         for message in update.get("messages", []):
#             message.pretty_print()


#---------------------------------------------------创建邮箱

# EMAIL_AGENT_PROMPT = (
#     "You are an email assistant. "
#     "Compose professional emails based on natural language requests. "
#     "Extract recipient information and craft appropriate subject lines and body text. "
#     "Use send_email to send the message. "
#     "Always confirm what was sent in your final response."
# )
# email_agent = create_agent(
#     model,
#     tools=[send_email],
#     system_prompt=EMAIL_AGENT_PROMPT,
# )
# query = "Send the design team a reminder about reviewing the new mockups"

# for step in email_agent.stream(
#     {"messages": [{"role": "user", "content": query}]}
# ):
#     for update in step.values():
#         for message in update.get("messages", []):
#             message.pretty_print()


#---------------------------------------------------创建主管
#将每一个子代理都封装为工具
@tool
def schedule_event(request: str) -> str:
    """Schedule calendar events using natural language.

    Use this when the user wants to create, modify, or check calendar appointments.
    Handles date/time parsing, availability checking, and event creation.

    Input: Natural language scheduling request (e.g., 'meeting with design team
    next Tuesday at 2pm')
    """
    result = calendar_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text


@tool
def manage_email(request: str) -> str:
    """Send emails using natural language.

    Use this when the user wants to send notifications, reminders, or any email
    communication. Handles recipient extraction, subject generation, and email
    composition.

    Input: Natural language email request (e.g., 'send them a reminder about
    the meeting')
    """
    result = email_agent.invoke({
        "messages": [{"role": "user", "content": request}]
    })
    return result["messages"][-1].text